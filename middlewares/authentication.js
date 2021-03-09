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
 * 1.0 - Version principal
 */

// Incluimos controladores, modelos, schemas y modulos
const jwt                   = require('jsonwebtoken');
const fs                    = require('fs');

const { configfile }        = require('../helper');
const Views                 = require('../views');
const Permissions           = require('../models/permissions');

const TOKEN_PASS    = fs.readFileSync('token.key','utf-8');
const cert          = fs.readFileSync('token.pub','utf-8');

// Models, Schemas & Controllers
const schemas = {
    token: require('../db/migrations/token.table'),
    roles: require('../db/migrations/roles.table')
};

const models = {
    users: require('../models/users'),
    clients: require('../models/clients')
};

class Auth {
    constructor(user, section) {
        this.user = user;
        this.section = section;
        return this;
    }

    async delete_old_tokens() {
        const tokens = await schemas.token.find({ userId: this.user._id }).sort({ createdAt: -1 });
        const { sessions_by_user } = configfile.security;
        const { expiresIn } = configfile.security.token;
        const now = Date.now();

        const Tokens_to_delete = [];

        let session_number = 1;
        for(let i = 0; i < tokens.length; i++) {
            const token = tokens[i];

            if(session_number >= sessions_by_user) {
                // sumamos el token para eliminarlo
                Tokens_to_delete.push(token._id);
            } else {
                // Consultamos si el token es valido en fecha
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

    async create_token(sessionId = false) {
        const { _id:id, role, name, last_name, email } = this.user;

        let session_to_insert = sessionId || (Date.parse(new Date)).toString() + id;

        const token_data = {
            id,
            role,
            name,
            last_name,
            email,
            sessionId: session_to_insert
        }
        // console.log(configfile.security.token)
        const token = jwt.sign(token_data, TOKEN_PASS, configfile.security.token);
        
        let c = new schemas.token({
            userId: id,
            token,
            sessionId: token_data.sessionId
        })
        c.save();

        return token;
    }
}

async function checkToken(req, res, next) {
    // Obtenemos los valores de la ubicacion 3 y 4 de la url
    let url = req.url;
    url = url.split('?')[0]; // Quitamos los queries
    url = [url.split('/')[3] || false, url.split('/')[4] || false];
    
    const { routesNotToken } = configfile.security;

    for(const [ method, module, route ] of routesNotToken) {
        if(url && url[0] != module) continue;

        if((url[1] && url[1] == route || route == "*") && (req.method == method || method == "ALL")) {
            next();
            return;
        }
    }

    const response = new Views(res);

    let token = req.headers.authorization;
    if(!token) return response.message("Token no especificado");
    const [ auth_type, auth_token ] = token.split(" ");
    if(auth_type != 'Bearer') return response.message("Tipo de authorization invalida");

    try {
        const token_response = await jwt.verify(auth_token, cert, { algorithms: ["RS256"] });
        if(token_response) {
            // Buscamos el token
            const token_verification = await schemas.token.findOne({ token: auth_token });
            if(!token_verification || token_verification.userId != token_response.id) return response.message("Token adulterado");
            let user;
            user = await models.users.get_loggin_user_data(token_response.id);

            user.token  = auth_token;
            req.authUser = user;
            res.authUser = user;
            next();
            return;
        }
    } catch (e) {
        console.log(e);
        console.log("Err: ", e.message);
        response.message("Error en token: Err:" + e.message);
    }
}

module.exports = { checkToken, Auth, get_response };