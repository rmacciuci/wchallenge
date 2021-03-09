/**
 * @fileoverview Main Controller
 * 
 * @version 1.0
 * 
 * @author Ramiro Macciuci <ramimacciuci@gmail.com>
 * @copyright Ramiro Macciuci - Argentina
 * 
 * History:
 * 1.0 - Version principal
 */

// Incluimos modulos externos
const fs        = require('fs');

// Incluimos modulos internos
const { Auth }  = require('../middlewares/authentication');
const helper    = require('../helper');
const Views     = require('../views');

// Incluimos Controladores, Modelos & Schemas
const models = {
    users: require('../models/users')
};

const schemas = {
}

module.exports = {
    login: async (req, res) => {
        const response = new Views(res);
        const { user_name, password } = req.body;

        try{
            if(user_name === undefined || password === undefined) throw new Error("Error en los parametros enviados");

            let consulta = await models.users.checkUserPassword(user_name, password);
            
            let token = new Auth(consulta);

            // Eliminamos los tokens vencidos y solo se aceptan N cantidad de sesiones especificadas en el setting
            await token.delete_old_tokens();

            // Creamos un nuevo token
            token = await token.create_token();

            if(!token) throw new Error("Error al generar el token");
            else return response.custom_response(202, true, "Usuario logeado correctamente", {}, Views.get_loggedUser_object(consulta, token));
        }catch (e) {    
            console.log(e);
            return response.message(e.message);
        }
    }
}