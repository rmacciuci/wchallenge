/**
 * @fileoverview Main Controller
 * 
 * @version 1.0
 * 
 * @author Ramiro Macciuci <ramimacciuci@gmail.com>
 * @copyright Ramiro Macciuci - Argentina
 * 
 * History:
 * First version
 */

// Include external modules
const fs        = require('fs');

// Include internal modules
const { Auth }  = require('../middlewares/authentication');
const Views     = require('../views');

// Include Controllers, Modules & Schemas
const models = {
    users: require('../models/users')
};

module.exports = {
    login: async (req, res) => {
        const response = new Views(res);
        const { user_name, password } = req.body;

        try{
            if(user_name === undefined || password === undefined) throw new Error("Error in sended values");

            let consulta = await models.users.checkUserPassword(user_name, password);
            
            let token = new Auth(consulta);

            // Delete old tokens
            await token.delete_old_tokens();

            // Create a new token
            token = await token.create_token();

            if(!token) throw new Error("Error creating token");
            else return response.custom_response(202, true, "User logged successfully", {}, Views.get_loggedUser_object(consulta, token));
        }catch (e) {    
            console.log(e);
            return response.message(e.message);
        }
    }
}