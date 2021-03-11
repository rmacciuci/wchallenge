/**
 * @fileoverview Coingecko Model
 * 
 * @version 1.0
 * 
 * @author Ramiro Macciuci <ramimacciuci@gmail.com>
 * @copyright Ramiro Macciuci - Argentina
 * 
 * History:
 * 1.0 - Version principal
 */

// Include external modules
const axios = require('axios');

const BASE_URL                  = "https://api.coingecko.com/api/v3"; // Coingecko base url
const AUTHORIZED_CURRENCIES     = ["usd", "ars", "eur"];

const Coingecho = {
    /**
     * This function get coins in coingecko endpoint. (/coins/markets) 
     * @param {Array} ids 
     * @param {String} preferred_currency 
     * @param {Object} search_params 
     */
    get: async(ids = [], preferred_currency, search_params = {}) => {
        if(!preferred_currency) throw new Error("Error in sended values");

        if(!AUTHORIZED_CURRENCIES.includes(preferred_currency)) throw new Error("Error en la moneda ingresada"); // Consultamos que la moneda esté autorizada

        // set recived search params or set default
        const limit     = search_params.limit || 50;
        const offset    = search_params.offset || 0;
        const order     = search_params.order  || 'market_cap_desc'; // Fijamos el orden DESC dependiendo ranking

        let url = `${BASE_URL}/coins/markets`; // Set URL
        url += `?vs_currency=${preferred_currency}`; // Add a preferred_currency to query
        url += `&per_page=${limit}&page=${offset}`; // Add a search params to URL
        url += `&order=${order}`; // Add a order param to URL

        // If ids are defined, We sended in URL
        if(ids && ids instanceof Array && ids.length > 0) {
            url += `&ids=${ids.join()}`; // Add ids separated with ,
        }

        try {
            const response = await axios.get(url);
            if(!response.data) throw new Error("Error al obtener las monedas");
            let return_data = [];
            for({ id, name, current_price: price, image, last_updated, symbol } of response.data) {
                const aux = {
                    id,
                    symbol,
                    price,
                    name,
                    image,
                    last_updated
                }
                return_data.push(aux);
            }
            return return_data;
        } catch (e) {
            throw e;
        }
    },
    /**
     * This function get specific prices in coingecko endpoint. (/simple/price) 
     * @param {String} ids 
     * @param {Array} currencies 
     */
    get_prices: async(ids, currencies = []) => {
        if(!ids || !ids instanceof Array) throw new Error("Error in sended values");

        currencies = currencies.filter(e => AUTHORIZED_CURRENCIES.includes(e)); // Filtramos en base a las monedas autorizadas
        
        let url = `${BASE_URL}/simple/price`; // Set URL
        url += `?vs_currencies=${currencies.join()}`; // Add a currencies separated with ,
        url += `&ids=${ids.join()}`; // Add coin ids separated with ,

        try {
            const response = await axios.get(url);
            if(!response.data) throw new Error("Error al obtener los precios");
            return response.data;
        } catch (e) {
            throw e;
        }
    }
}

module.exports = Coingecho;