/**
 * @fileoverview User Model
 * 
 * @version 1.0
 * 
 * @author Ramiro Macciuci <ramimacciuci@gmail.com>
 * @copyright RM Dev - Argentina
 * 
 * History:
 * 1.0 - Version principal
 */

// Incluimos moduloes externos
const password_hash = require('password-hash');
const jwt           = require('jsonwebtoken');

// Incluimos modulos internos
const helper        = require('../helper');

// Models & Controllers & Schemas
const schemas = {
    users: require('../db/schemas/users.table')
};
class User {
    constructor({ name, last_name, user_name, password, preferred_currency }) { 
        this.name               = name;
        this.last_name          = last_name;
        this.user_name          = user_name;
        this.password           = password;
        this.preferred_currency = preferred_currency;
    }

    async save() {
        // Verificamos los valores requeridos
        const required_values = ["name", "last_name", "user_name", "password", "preferred_currency"];
        const [verify, this_object] = helper.verify_object_from_array(this, required_values, []);
        if(verify) throw new Error(verify);

        // Comprobamos si existe el usuario con ese nombre de usuario
        const user_exist = await schemas.users.find({ user_name: this_object.user_name });
        if(user_exist.length > 0) throw new Error("Usuario existente");

        // Comprobamos que la clave tenga al menos 8 caracteres y sea alfanumerica
        const check_password = helper.check_alphanumeric_password(this_object.password, 8)
        if(!check_password) throw new Error("Contraseña ingresada poco segura");
        else {
            // Guardamos la contraseña encriptada
            this_object.password = check_password
        }

        const PERMITED_CURRENCIES = ["eur", "ars", "usd"];
        if(!PERMITED_CURRENCIES.includes(this_object.preferred_currency)) throw new Error("Error en el tipo de moneda ingresada");

        let user        = new schemas.users(this_object);
        user            = await user.save();

        if(user) return await User.get(user._id);
        else return false;
    }

    static async get(id) {
        if(!id) throw new Error("Error en los parametros enviados");

        const query = await schemas.users.findById(id);
        if(!query) throw new Error("Usuario inexistente");
        else {
            const { _id: id, name, last_name, user_name, createdAt, updatedAt, preferred_currency } = query;
            return { 
                id, 
                name, 
                last_name, 
                user_name, 
                createdAt, 
                updatedAt, 
                preferred_currency 
            }
        }
    }

    static async get_loggin_user_data(user_id) {
        if(!user_id) throw new Error("Error en los parametros enviados");
        
        try {
            // Buscamos el usuario
            const user = await this.get(user_id);
            return user;
        } catch (e) {
            throw e;
        }
    }

    static async checkUserPassword(user_name, password) {
        if(!user_name || !password) throw new Error("Error en los parametros enviados");

        // Buscamos si existe el usuario 
        let user = await schemas.users.find({ user_name });
        if(user.length === 0) throw new Error("Usuario inexistente");
        user = user[0];

        let originPass = user.password;
        if(!password_hash.verify(password, originPass)) throw new Error('Contraseña Erronea');
        else return user;
    }
}

module.exports = User;