/**
 * @fileoverview Routes | routes main file 
 * Aqui se definen todas las rutas existentes en la app
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

// Incluimos modulos externos
const express       = require('express');
const app           = express();
const helper        = require('../helper');

const routesPath    = helper.configfile.main.route;

app.use(`${routesPath}/`, require('./base')); // custom routes
app.use(`${routesPath}/users`, require('./users')); // users routes

module.exports = app;