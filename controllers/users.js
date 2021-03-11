/**
 * @fileoverview Users controller
 * 
 * @version 1.0
 * 
 * @author Ramiro Macciuci <ramimacciuci@gmail.com>
 * @copyright Ramiro Macciuci - Argentina
 * 
 * History:
 * 1.0 - Version principal
 */

// Include internal modules
const helper = require('../helper');
const Views = require('../views');

// Include Controllers, Modules & Schemas
const models = {
    users: require('../models/users')
};

const controller = {
    get: async (req, res) => {
        const response = new Views(res);
        
        models.users.get(req.authUser.id).then(v => {
            if(!v) return response.message("Internal error")
            else return response.get(v);
        }).catch(e => {
            console.log("Error: ", e);
            return response.message(e.message);
        })
    },
    new: async (req, res) => {
        const response = new Views(res);

        if(!req.body) return response.message("Error in sended values");
        
        const user = new models.users(req.body);
        user.save().then(v => {
            if(!v) return response.message("Internal error")
            else return response.create(v);
        }).catch(e => {
            console.log("Error: ", e);
            return response.message(e.message);
        })
        
    }
}

module.exports = controller;