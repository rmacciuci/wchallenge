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

const fs            = require('fs');
const path          = require('path');
const Views         = require('./views');
const jwt           = require('jsonwebtoken');

const controller = {
    configfile: JSON.parse(fs.readFileSync("./settings/settings.json")),
    external_api_keys: JSON.parse(fs.readFileSync("./settings/external_api_keys.json")),
    token_pass_verification: 'TOKENVERIFICATIONDATAWITHRAMIROMACCIUCI1290149838942bj4bhj32bhj42hj3b4jh2b3hj4v23hj4h23v4hgv23hg4vh23',
    get_token: async (userId, section, onVerify) => {
        const verify_token_schema = require('./db/migrations/verify_tokens.table')

        const token_data = {
            userId,
            section,
            onVerify
        }
        const token =  await jwt.sign(token_data, controller.token_pass_verification, { 
            expiresIn: '365d'
        })

        // Guardamos el token para verificar
        const query = new verify_token_schema({ ...token_data, token });
        const save = await query.save();

        return token;
    },
    get_custom_variables_for_get_methods: ({ order = 'DESC', orderBy = 'createdAt', limit = 10, offset = 0 }) => {
        let sort_return    = {};
        let skip_return    = 0;
        let limit_return   = 50;

        sort_return[orderBy] = order === "ASC" ? 1 : -1;
        skip_return         = parseInt(offset) || 0;
        limit_return        = parseInt(limit)  || 50;

        return [ sort_return, skip_return, limit_return ];
    },
    getDatabaseName: (table) => `tbl_${table}`,
    check_str_length(string, max_length = 255) {
        if(!string) return false;
        string = string.toString();
        if(string.length > max_length) return false;
        else return true;
    },
    verify_object_from_authorizedColumns: (object = {}, authorizedColumns = []) => {
        let object_return = {}; 
        for(let i in object) {
            if(authorizedColumns.includes(i)) {
                object_return[i] = object[i];
            }
        }
        return object_return
    },
    /**
     * Funcion que envia una fecha y convienrte en GMT 0
     * @param {*} date 
     */
    date_to_UTCDate: (date) => {
        date = new Date(date);
        
        const horas_resta = date.getUTCHours();
        const resta = (((60 * 60) * horas_resta) * 1000);

        date = Date.parse(date);

        return new Date(date - resta);
    },
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
    users: {
    },   
    format_currency_values: (value, country) => {
        const coins = {
            EEUU: { LOCALE: "en-US", CURRENCY: "USD" }
        }

        const selected_country = coins[country.toUpperCase()];

        if(!selected_country) throw new Error("Pais no encontrado");
        if(isNaN(value)) throw new Error("Error en el valor ingreasdo");

        return Number(value).toLocaleString(selected_country.LOCALE, {
            style: 'currency',
            currency: selected_country.CURRENCY
        });
    }
}

module.exports = controller;