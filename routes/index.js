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

// Incluimos controladores, modelos, schemas y modulos
const express       = require('express');
const app           = express();
const helper        = require('../helper');

const routesPath    = helper.configfile.main.route;

app.use(`${routesPath}/`, require('./base')); // custom routes
app.use(`${routesPath}/users`, require('./users')); // users routes
app.use(`${routesPath}/clients`, require('./clients')); // clients routes
app.use(`${routesPath}/profile`, require('./profile')); // profile routes
app.use(`${routesPath}/files`, require('./files')); // users routes
app.use(`${routesPath}/external`, require('./external')); // users routes

// Incluimos las rutas de los modulos
const modules = global.modules;
for(let x = 0; x < modules.length; x++){
    app.use(`${routesPath}/${modules[x].name}`, modules[x].requires.routes)
}

module.exports = app;