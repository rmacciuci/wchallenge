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

// Incluimos modulos externos
const jwt                   = require('jsonwebtoken');
const fs                    = require('fs');

// Incluimos modulos internos
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

    /**
     * Eliminamos los tokens viejos en base a los parametros configurados en los archivos de configuracion
     */
    async delete_old_tokens() {
        // Obtenemos los tokens del usuario
        const tokens = await schemas.token.find({ userId: this.user._id }).sort({ createdAt: -1 });

        // Obtenemos los valores de seguridad para los tokens
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

    /**
     * Creamos un token
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
    
            await c.save(); // Guardamos el token en la bbdd
            return token;
        } catch (e) {
            throw e;
        }
    }
}

/**
 * Middelware que chequea el token ingresado. Si la ruta esta incluida en el archivo de configuracion entonces no lo solicitará, en caso contrario hara multiples verificaciones de seguridad.
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next 
 */
async function checkToken(req, res, next) {

    // Obtenemos los valores de la ubicacion 3 y 4 de la url
    let url = req.url;
    url = url.split('?')[0]; // Quitamos los queries
    url = [url.split('/')[3] || false, url.split('/')[4] || false];
    
    const { routesNotToken } = configfile.security; // Obtenemos las rutas que no requeriran token

    for(const [ method, module, route ] of routesNotToken) {
        if(url && url[0] != module) continue;

        if((url[1] && url[1] == route || route == "*") && (req.method == method || method == "ALL")) {
            next();
            return;
        }
    }
    // Creamos el objeto de respuesta
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
            user = await models.users.get_loggin_user_data(token_response.id); // Obtenemos los datos del usuario logeado segun el token

            user.token  = auth_token;

            // Guardamos los datos del usuario logeado en los objetos req y res
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