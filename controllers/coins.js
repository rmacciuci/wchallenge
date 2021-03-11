/**
 * @fileoverview Coins controller
 * 
 * @version 1.0
 * 
 * @author Ramiro Macciuci <ramimacciuci@gmail.com>
 * @copyright Ramiro Macciuci - Argentina
 * 
 * History:
 * First version
 */

// Include internal modules
const Views = require('../views');

// Include Controllers, Modules & Schemas
const models = {
    coingecko: require('../models/coingecko')
};

const controller = {
    get: async (req, res) => {
        const response = new Views(res);

        // Obtenemos la moneda preferida del cliente
        const { preferred_currency } = req.authUser;
        
        models.coingecko.get([],preferred_currency,req.query).then(v => {
            if(!v) return response.message("Error al obtener las monedas")
            else return response.get(v);
        }).catch(e => {
            console.log("Error: ", e);
            return response.message(e.message);
        })
    }
}

module.exports = controller;