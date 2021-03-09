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

// Incluimos controladores, modelos, schemas y modulos
const helper = require('../helper');
const { get_response } = require('../middlewares/authentication');
const Views = require('../views');

// Models & Controllers
const controllers = {};

const models = {
    users: require('../models/users')
};

const controller = {
    get: async (req, res) => {
        const [ response, auth ] = await get_response(res, 'users', 'view');
        // if(!auth[0]) return response.message(auth[1]);
        
        let { id } = req.params;
        let search_params = req.query;

        if(!auth[0]) {
            // Si no tiene permisos sobre esta seccion devolvemos su usuario
            id = req.authUser.id;
            search_params = {};
        }

        models.users.get(id, search_params).then(v => {
            if(!v) return response.message("Error al obtener usuarios")
            else return response.get(v);
        }).catch(e => {
            console.log("Error: ", e);
            return response.message(e.message);
        })
    },
    new: async (req, res) => {
        const [ response, auth ] = await get_response(res, 'users', 'new');
        if(!auth[0]) return response.message(auth[1]);

        if(!req.body) return response.message("Error en los parametros enviados");

        const user = new models.users(req.body);

        user.save().then(v => {
            if(!v) return response.message("Error al crear usuario")
            else return response.create(v);
        }).catch(e => {
            console.log("Error: ", e);
            return response.message(e.message);
        })
        
    },
    pwrecovery: async (req, res) => {
        const response = new Views(res);

        const { email } = req.body;
        if(!email) return response.message("Error en los parametros enviados");

        models.users.pwrecovery(email).then(v => {
            if(!v) return response.message("Error al obtener una nueva contraseña");
            else return response.message("Si existe un usuario con su email recibira un email en el mismo", true);
        }).catch(e => {
            console.log("Error: ", e);
            return response.message(e.message);
        })
    },
    modify: async (req, res) => {
        const [ response, auth ] = await get_response(res, 'users', 'modify');
        // if(!auth[0]) return response.message(auth[1]);
        let id = false;

        let autorizedColumns = ["name", "last_name", "password", "birthday", "phone", "gender"];
        if(auth[0]) {
            // Agregamos permiso de editar mas rows
            id = req.params.id || req.authUser.id;
            const MoreAuthorizedColumns = ["role", "active"];
            autorizedColumns = [...autorizedColumns, ...MoreAuthorizedColumns];
        } else {
            id = req.authUser.id;
        }

        let modifyData = helper.verify_object_from_authorizedColumns(req.body, autorizedColumns);
        models.users.modify(id, modifyData).then(v => {
            if(!v) return response.message("Error al modificar el usuario")
            else return response.update(v);
        }).catch(e => {
            console.log("Error: ", e);
            return response.message(e.message);
        })
    },
    delete: async (req, res) => {
        const [ response, auth ] = await get_response(res, 'users', 'delete');
        if(!auth[0]) return response.message(auth[1]);

        const { id } = req.params;
        if(!id) return response.message("Error en los parametros enviados");

        models.users.delete(id).then(v => {
            if(!v) return response.message("Error al eliminar el usuario")
            else return response.delete(v);
        }).catch(e => {
            console.log("Error: ", e);
            return response.message(e.message);
        })
    },
    changePassword: async (req, res) => {
        const [ response, auth ] = await get_response(res, 'all', 'all', "admin");
        const id = req.authUser.id;

        const { password } = req.body;
        if(!password) return response.message("Error en los parametros enviados");

        models.users.modify(id, { password }).then(v => {
            if(!v) return response.message("Error al modificar el usuario")
            else return response.update(v);
        }).catch(e => {
            console.log("Error: ", e);
            return response.message(e.message);
        })
    }
}

module.exports = controller;