/**
 * @fileoverview Top Coins controller
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
    top_coins: require('../models/top_coins')
};

const controller = {
    get: async (req, res) => {
        const response = new Views(res);
        
        models.top_coins.get(req.authUser.id, req.query).then(v => {
            if(!v) return response.message("Internal error")
            else return response.get(v);
        }).catch(e => {
            console.log("Error: ", e);
            return response.message(e.message);
        })
    },
    toggle_favorite_coin: async (req, res) => {
        const response = new Views(res);

        const { coin_id } = req.params;
        models.top_coins.toggle_assign(req.authUser.id, coin_id).then(v => {
            if(!v) return response.message("Internal error")
            else return response.update(v);
        }).catch(e => {
            console.log("Error: ", e);
            return response.message(e.message);
        })
    }
}

module.exports = controller;