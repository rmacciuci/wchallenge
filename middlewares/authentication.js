/**
 * @fileoverview Middleware | Middleware de autenticacion que valida token
 * 
 * @version 1.0
 * 
 * @author Ramiro Macciuci <ramimacciuci@gmail.com>
 * 
 * @copyright Ramiro Macciuci - Buenos Aires, Argentina
 * 
 * History:
 * First version
 */

// Include external modules
const jwt                   = require('jsonwebtoken');
const fs                    = require('fs');

// Include internal modules
const { configfile }        = require('../helper');
const Views                 = require('../views');

// token keys
const TOKEN_PASS    = fs.readFileSync('token.key','utf-8');
const cert          = fs.readFileSync('token.pub','utf-8');

// Models, Schemas & Controllers
const schemas = {
    token: require('../db/schemas/token.table')
};

const models = {
    users: require('../models/users')
};

class Auth {
    constructor(user) {
        this.user = user;
        return this;
    }

    async delete_old_tokens() {
        // get user tokens
        const tokens = await schemas.token.find({ userId: this.user._id }).sort({ createdAt: -1 });

        // Get security values specified in setting file
        const { sessions_by_user } = configfile.security;
        const { expiresIn } = configfile.security.token;
        const now = Date.now();

        const Tokens_to_delete = [];

        let session_number = 1;
        for(let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            if(session_number >= sessions_by_user) {
                // add token to array
                Tokens_to_delete.push(token._id);
            } else {
                // Check if token is valid
                const data = Date.parse(token.createdAt);

                const expiresData = data + expiresIn;

                if(expiresData > now) {
                    Tokens_to_delete.push(token._id);
                }
            }

            session_number += 1;
        }

        await schemas.token.deleteMany({ _id: {$in: Tokens_to_delete} });
        return true;
    }

    /**
     * Create a token
     * @param {Any} sessionId 
     */
    async create_token(sessionId = false) {
        const { _id:id, name, last_name, user_name } = this.user;

        let session_to_insert = sessionId || (Date.parse(new Date)).toString() + id;

        const TOKEN_DATA = {
            id,
            name,
            last_name,
            user_name,
            sessionId: session_to_insert
        }
        try {
            const token = jwt.sign(TOKEN_DATA, TOKEN_PASS, configfile.security.token);
        
            let c = new schemas.token({
                userId: id,
                token,
                sessionId: TOKEN_DATA.sessionId
            })
    
            await c.save(); // Save a token in database
            return token;
        } catch (e) {
            throw e;
        }
    }
}

/**
 * Middelware check a recibed token. If the route is specified in setting file, it will not require token
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next 
 */
async function checkToken(req, res, next) {

    // Get a url values
    let url = req.url;
    url = url.split('?')[0]; // Quitamos los queries
    url = [url.split('/')[3] || false, url.split('/')[4] || false];
    
    const { routesNotToken } = configfile.security; // Get routes that do not require token

    for(const [ method, module, route ] of routesNotToken) {
        if(url && url[0] != module) continue;

        if((url[1] && url[1] == route || route == "*") && (req.method == method || method == "ALL")) {
            next();
            return;
        }
    }
    // Create a response object
    const response = new Views(res);

    try {
        let token = req.headers.authorization;
        if(!token) throw new Error("Token no especificado");

        const [ auth_type, auth_token ] = token.split(" ");
        if(auth_type != 'Bearer') throw new Error("Tipo de authorization invalida");

        const token_response = await jwt.verify(auth_token, cert, { algorithms: ["RS256"] });
        if(token_response) {

            // Buscamos el token
            const token_verification = await schemas.token.findOne({ token: auth_token });
            if(!token_verification || token_verification.userId != token_response.id) throw new Error("Token adulterado");
            
            let user;
            user = await models.users.get(token_response.id); // Get a logged user object

            user.token  = auth_token;

            // Save logged user data in req and res
            req.authUser = user;
            res.authUser = user;

            next();
            return;
        } else throw new Error("Error en el token");
    } catch (e) {
        console.log(e);
        return response.message("Error en token: Err:" + e.message);
    }
}

module.exports = { checkToken, Auth };