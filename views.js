/**
 * @fileoverview Schema of main response
 * 
 * @version 1.0
 * 
 * 
 * @author Ramiro Macciuci <ramimacciuci@gmail.com>
 * @copyright Ramiro Macciuci - Argentina
 * 
 * History:
 * First version
 */

// Include external modules
const path   = require('path');
class Views {
    constructor(res) {
        this.res = res;
    }

    /**
     * Default function to response schema
     * 
     * @param {Boolean} Success 
     * @param {Number}  code 
     * @param {String}  Message
     * @param {object}  data
     * @param {object}  user
     * 
     * @returns {}
     */
    async custom_response(code = 200, Success = true, Message = "", data = {}, user = false) {
        let return_schema = {
            Success,
            Message,
            HttpCodeResponse: code,
        }

        if(Object.keys(data).length > 0) {
            return_schema.Data = data;
        }

        if(user === false && this.res.authUser) {
            return_schema.loggedUser = this.res.authUser ? Views.get_loggedUser_object(this.res.authUser) : user;
        } else {
            return_schema.loggedUser = user;
        }

        return this.res.status(code).send(return_schema);
    }

    static get_loggedUser_object(user, token) {
        return {
            token: token ? token : user.token,
            id: user.id,
            name: user.name,
            last_name: user.last_name,
            user_name: user.user_name,
            preferred_currency: user.preferred_currency
        }
    }

    delete(data = {}) {
        return this.custom_response(200, true, "Record deleted successfully", data);
    }

    create(data = {}) {
        return this.custom_response(200, true, "Record created successfully", data);
    }

    update(data = {}) {
        return this.custom_response(200, true, "Record updated sucessfully", data);
    }

    get(data = {}, Message = "") {
        return this.custom_response(200, true, Message, data);
    }

    message(Message, Success = false) {
        let code = 200;
        if(!Success) {
            code = 400;
        }

        return this.custom_response(code, Success, Message);
    }
}

module.exports = Views;