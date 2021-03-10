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
const axios = require('axios');

// Incluimos modulos internos
const helper        = require('../helper');

// Models & Controllers & Schemas
const schemas = {
};

const BASE_URL          = "https://api.coingecko.com/api/v3";
const AUTHORIZED_CURRENCIES   = ["usd", "ars", "eur"];

const Coingecho = {
    get: async(ids = [], preferred_currency, search_params = {}) => {
        if(!preferred_currency) throw new Error("Error en los parametros enviados");

        if(!AUTHORIZED_CURRENCIES.includes(preferred_currency)) throw new Error("Error en la moneda ingresada"); // Consultamos que la moneda esté autorizada

        // Seteamos parametros de busqueda
        const limit     = search_params.limit || 50;
        const offset    = search_params.offset || 0;
        const order     = search_params.order  || 'market_cap_desc'; // Fijamos el orden DESC dependiendo ranking

        let url = `${BASE_URL}/coins/markets`; // Seteamos la URL
        url += `?vs_currency=${preferred_currency}`; // Agregamos la moneda a la consulta
        url += `&per_page=${limit}&page=${offset}`; // Agregamos los parametros de busqueda a la URL.
        url += `&order=${order}`; // Agregamos el parametro de orden

        // Agregamos los IDs en caso de requerirlos
        if(ids && ids instanceof Array && ids.length > 0) {
            url += `&ids=${ids.join()}`; // Agregamos los IDS separados por coma
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
    get_prices: async(ids, currencies = []) => {
        if(!ids || !ids instanceof Array) throw new Error("Error en los parametros enviados");

        currencies = currencies.filter(e => AUTHORIZED_CURRENCIES.includes(e)); // Filtramos en base a las monedas autorizadas
        
        let url = `${BASE_URL}/simple/price`; // Seteamos la URL
        url += `?vs_currencies=${currencies.join()}`; // Agregamos las monedas separadas por coma
        url += `&ids=${ids.join()}`; // Agregamos los IDS separados por coma

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