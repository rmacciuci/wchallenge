/**
 * @fileoverview Routes | routes entry file 
 * 
 * 
 * @version 1.0 
 * 
 * 
 * @author Ramiro Macciuci <ramimacciuci@gmail.com>
 * @copyright Ramiro Macciuci - Argentina
 * 
 * History:
 * 1.0 - Version principal
 */

// Include external modules
const express       = require('express');
const app           = express();
const helper        = require('../helper');

const routesPath    = helper.configfile.main.route;

app.use(`${routesPath}/`, require('./base')); // custom routes
app.use(`${routesPath}/user`, require('./user')); // users routes
app.use(`${routesPath}/top_coins`, require('./top_coins')); // top_coins routes
app.use(`${routesPath}/coins`, require('./coins')); // coins routes

module.exports = app;