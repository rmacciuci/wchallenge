/**
 * @fileoverview User Model
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
const password_hash = require('password-hash');

// Include internal modules
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

    /**
     * This function verify and save new user
     */
    async save() {
        // Verify requested values
        const required_values = ["name", "last_name", "user_name", "password", "preferred_currency"];
        const [verify, this_object] = helper.verify_object_from_array(this, required_values, []);
        if(verify) throw new Error(verify);

        // Check if the user exists
        const user_exist = await schemas.users.find({ user_name: this_object.user_name });
        if(user_exist.length > 0) throw new Error("Usuario existente");

        // Check the password is alphanumeric and more 8 chars
        const check_password = helper.check_alphanumeric_password(this_object.password, 8)
        if(!check_password) throw new Error("Contraseña ingresada poco segura");
        else {
            // Save a encrypted password
            this_object.password = check_password
        }

        // Check preferred_currency 
        const PERMITED_CURRENCIES = ["eur", "ars", "usd"];
        if(!PERMITED_CURRENCIES.includes(this_object.preferred_currency)) throw new Error("Error en el tipo de moneda ingresada");

        let user        = new schemas.users(this_object);
        user            = await user.save();

        if(user) return await User.get(user._id);
        else return false;
    }

    /**
     * This function get a unique user by ID
     * @param {String} id 
     */
    static async get(id) {
        if(!id) throw new Error("Error in sended values");

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

    /**
     * This function verify user and password
     * @param {String} user_name 
     * @param {String} password 
     */
    static async checkUserPassword(user_name, password) {
        if(!user_name || !password) throw new Error("Error in sended values");

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