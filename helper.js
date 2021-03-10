/**
 * @fileoverview Helpers functions
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

// Incluimos los modulos externos
const fs            = require('fs');
const path          = require('path');
const Views         = require('./views');
const jwt           = require('jsonwebtoken');
const password_hash = require('password-hash');

const controller = {
    configfile: JSON.parse(fs.readFileSync("./settings/settings.json")),
    getDatabaseName: (table) => `tbl_${table}`,
    verify_object_from_array: (object = {}, required_values = [], not_permited_rows = []) => {
        let error = false;
        let object_return = {};

        for(let i of required_values) {
            const value = object[i];

            if(value === undefined) {
                const message_error = `Falta el valor de ${i}`;
                error = error === false ? message_error : `${error} / ${message_error}`
            }
        }

        if(!error) {
            // Eliminamos los valores undefined 
            for(let t in object) {
                if(not_permited_rows.includes(t)) continue;

                if(object[t] !== undefined){
                    object_return[t] = object[t]
                }
            }
        }

        return [error, object_return];
    },
    check_alphanumeric_password: (password, min_length = 8) => {
        if(!password || password.length < min_length) return false;

        // Seteamos las expresiones regulares
        const REGEXP_NUMERIC = new RegExp(/[0-9]/);
        const REGEXP_ALPHA   = new RegExp(/[a-zA-Z]/);

        if(REGEXP_NUMERIC.test(password) && REGEXP_ALPHA.test(password)) {
            return password_hash.generate(password)
        } else return false;
    }
}

module.exports = controller;