/**
 * @fileoverview Top Coins Model
 * 
 * @version 1.0
 * 
 * @author Ramiro Macciuci <ramimacciuci@gmail.com>
 * @copyright Ramiro Macciuci - Argentina
 * 
 * History:
 * First version
 */

// Models & Controllers & Schemas
const schemas = {
    top_coins: require('../db/schemas/top_coins.table')
};

const models = {
    coingecko: require('./coingecko'),
    users: require('./users')
}

const Top_Coins = {
    /**
     * This function get a user top_coins
     * @param {String} user_id 
     * @param {Object} search_params 
     */
    get: async (user_id, search_params = {}) => {
        if(!user_id) throw new Error("Error in sended values");

        // Add recived search params or set default
        let order = search_params.order?.toUpperCase()  || "DESC";
        let limit = search_params.limit > 25            || !search_params.limit ? 25 : search_params.limit;

        // Get user data
        const user = await models.users.get(user_id);
        if(!user) throw new Error("Usuario inexistente")

        // Get top coins of user
        const query = await schemas.top_coins.find({ user_id });
        if(query.length === 0) throw new Error("El usuario no tiene monedas asignadas");

        // Generate a new array with coins id separated with ,
        const coins_ids = [query.map(coin => coin.coin_id)];

        // Get coins and prices of all user top coins
        let all_coins     = await models.coingecko.get(coins_ids, user.preferred_currency);
        const coins_prices  = await models.coingecko.get_prices(coins_ids, ["usd", "ars", "eur"]);

        // Order all coins by price (defautl DESC). This filter is inexistent by coingecko endpoint
        all_coins = all_coins.sort((a,b) => order === 'DESC' ? b.price - a.price : a.price - b.price);
 
        const return_data = [];
        for(const money of all_coins) {
            if(return_data.length >= limit) break; // Apply get limit

            // Search price in coins_prices var
            const prices = coins_prices[money.id];

            const aux = {
                id: money.id,
                symbol: money.symbol,
                name: money.name,
                image: money.image,
                preferred_currency: user.preferred_currency,
                last_updated: money.last_updated,
                prices
            }
            return_data.push(aux)
        }
        return return_data;
    },
    /**
     * This function toggle assign coin to user
     * @param {String} user_id 
     * @param {String} coin_id 
     */
    toggle_assign: async(user_id, coin_id) => {
        if(!user_id || !coin_id) throw new Error("Error in sended values");

        // Verify if coin exists for the specified user
        const query = await schemas.top_coins.find({ user_id, coin_id });
        if(query.length > 0) {
            // Then will delete top_coin
            const del = await schemas.top_coins.deleteOne({ _id: query[0]._id });
            if(del.ok === 0) throw new Error("Error al eliminar el registro");
        } else {
            // Then will add top_coin
            const new_coin = new schemas.top_coins({ user_id, coin_id });
            const save = await new_coin.save();
            if(!save) throw new Error("Error al guardar el registro")
        }
        return await Top_Coins.get(user_id);
    }
}

module.exports = Top_Coins;