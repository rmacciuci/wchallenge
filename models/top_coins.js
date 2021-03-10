/**
 * @fileoverview Top Coins Model
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
const axios = require('axios');

// Incluimos modulos internos
const helper        = require('../helper');

// Models & Controllers & Schemas
const schemas = {
    top_coins: require('../db/schemas/top_coins.table')
};

const models = {
    coingecko: require('./coingecko'),
    users: require('./users')
}

const Top_Coins = {
    get: async (user_id, search_params = {}) => {
        if(!user_id) throw new Error("Error en los parametros enviados");

        const [ sort, skip, limit ] = helper.get_custom_variables_for_get_methods(search_params);

        // Obtenemos los datos del usuario para saber su moneda preferida
        const user = await models.users.get(user_id);
        if(!user) throw new Error("Usuario inexistente")

        // Obtenemos las monedas preferidas del usuario
        const query = await schemas.top_coins.find({ user_id }).limit(limit).skip(skip).sort(sort);
        if(query.length === 0) throw new Error("El usuario no tiene monedas asignadas");

        // generamos un array con todos los IDs para hacer la consulta
        const coins_ids = [query.map(coin => coin.coin_id)];

        // Hacemos el request de monedas y precios
        const all_coins     = await models.coingecko.get(coins_ids, user.preferred_currency);
        const coins_prices  = await models.coingecko.get_prices(coins_ids, ["usd", "ars", "eur"]);

        let return_data = [];
        for(const { coin_id } of query) {
            // Obtenemos los datos de la moneda
            const money = all_coins.find(elem => elem.id === coin_id);

            // Obtenemos los precios de todas las cotizaciones
            const prices = coins_prices[coin_id];

            if(!money || !prices) continue; // Si la moneda no existe entonces la salteamos
            const aux = {
                id: money.id,
                symbol: money.symbol,
                name: money.name,
                image: money.image,
                last_updated: money.last_updated,
                prices
            }

            return_data.push(aux)
        }
        return return_data;
    },
    toggle_assign: async(user_id, coin_id) => {
        if(!user_id || !coin_id) throw new Error("Error en los parametros enviados");

        // Consultamos si la moneda ya existe para el usuario ingresado
        const query = await schemas.top_coins.find({ user_id, coin_id });
        if(query.length > 0) {
            // Significa que vamos a eliminar el registro 
            const del = await schemas.top_coins.deleteOne({ _id: query[0]._id });
            if(del.ok === 0) throw new Error("Error al eliminar el registro");
        } else {
            // Agregamos la moneda
            const new_coin = new schemas.top_coins({ user_id, coin_id });
            const save = await new_coin.save();
            if(!save) throw new Error("Error al guardar el registro")
        }
        return await Top_Coins.get(user_id);
    }
}

module.exports = Top_Coins;