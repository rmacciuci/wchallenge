/**
 * @fileoverview Estructura de respuesta principal
 * 
 * @version 1.0
 * 
 * 
 * @author Ramiro Macciuci <ramimacciuci@gmail.com>
 * @copyright RM Dev - Argentina
 * 
 * History:
 * 1.0 - Version principal
 */

// Incluimos controladores, modelos, schemas y modulos
const path   = require('path');
class Views {
    constructor(res) {
        this.res = res;
    }

    /**
     * Funcion default para responses, crea la estructura unica de respuesta
     * 
     * @param {Boolean} Success true si no hay errores
     * @param {Number}  code codigo de respuesta HTTP
     * @param {String}  Message mensaje para agregar a la respuesta
     * @param {object}  data respuesta principal de información
     * @param {object}  user usuario logeado, default = false, y buscara el usuario logeado con su respectivo token
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
        return this.custom_response(200, true, "Registro eliminado correctamente", data);
    }

    create(data = {}) {
        return this.custom_response(200, true, "Registro creado correctamente", data);
    }

    update(data = {}) {
        return this.custom_response(200, true, "Registro actualizado correctamente", data);
    }

    get(data = {}, Message = "Datos solicitados") {
        return this.custom_response(200, true, Message, data);
    }

    download(file) {
        return this.res.download(path.resolve(file));
    }

    send_file(file) {
        return this.res.sendFile(path.resolve(file));
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