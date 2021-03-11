/**
 * @fileoverview Helpers functions
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
const fs            = require('fs');
const path          = require('path');
const jwt           = require('jsonwebtoken');
const password_hash = require('password-hash');

// Include internal modules
const Views         = require('./views');

const controller = {
    configfile: JSON.parse(fs.readFileSync("./settings/settings.json")),
    getDatabaseName: (table) => `tbl_${table}`,
    /** This function verifies the data and returns array with filtred data  */
    verify_object_from_array: (object = {}, required_values = [], not_permited_rows = []) => {
        let error = false;
        let object_return = {};

        // Verify required_columns 
        for(let i of required_values) {
            const value = object[i];

            if(value === undefined) {
                const message_error = `Falta el valor de ${i}`;
                error = error === false ? message_error : `${error} / ${message_error}`
            }
        }

        if(!error) {
            // Delete undefined values
            for(let t in object) {
                if(not_permited_rows.includes(t)) continue;

                if(object[t] !== undefined){
                    object_return[t] = object[t]
                }
            }
        }

        return [error, object_return];
    },
    /** This function verifies that key meets the security requirements */
    check_alphanumeric_password: (password, min_length = 8) => {
        if(!password || password.length < min_length) return false;

        // Set regexp
        const REGEXP_NUMERIC = new RegExp(/[0-9]/);
        const REGEXP_ALPHA   = new RegExp(/[a-zA-Z]/);

        if(REGEXP_NUMERIC.test(password) && REGEXP_ALPHA.test(password)) {
            return password_hash.generate(password)
        } else return false;
    }
}

module.exports = controller;