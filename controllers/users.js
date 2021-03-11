/**
 * @fileoverview Controller of users
 * 
 * @version 1.0
 * 
 * @author Ramiro Macciuci <ramimacciuci@gmail.com>
 * @copyright RM Dev - Argentina
 * 
 * History:
 * 1.0 - Version principal
 */

// Incluimos modulos externos

// Incluimos modulos internos
const helper = require('../helper');

const Views = require('../views');

// Incluimos Controladores, Modelos & Schemas
const models = {
    users: require('../models/users')
};

const controller = {
    get: async (req, res) => {
        return res.send(true);  
        const response = new Views(res);
        
        models.users.get(req.authUser.id).then(v => {
            if(!v) return response.message("Error al obtener usuarios")
            else return response.get(v);
        }).catch(e => {
            console.log("Error: ", e);
            return response.message(e.message);
        })
    },
    new: async (req, res) => {
        const response = new Views(res);

        if(!req.body) return response.message("Error en los parametros enviados");
        
        const user = new models.users(req.body);
        user.save().then(v => {
            if(!v) return response.message("Error al crear usuario")
            else return response.create(v);
        }).catch(e => {
            console.log("Error: ", e);
            return response.message(e.message);
        })
        
    }
}

module.exports = controller;