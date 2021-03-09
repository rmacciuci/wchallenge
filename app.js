/**
 * @fileoverview Archivo principal de la API
 * 
 * @version 1.0
 * 
 * 
 * @author Ramiro Macciuci <ramimacciuci@gmail.com>
 * @copyright RM Developer - Argentina
 * 
 * History:
 * 1.0 - Version principal
 */

// Mains includes
const express       = require("express");
const cors          = require('cors');
const file_upload   = require('express-fileupload');
const body_parser   = require('body-parser');
const os            = require('os');
const morgan        = require('morgan');
const { configfile } = require("./helper");

const { checkToken } = require("./middlewares/authentication");

const app = express(); // Iniciamos express
global.baseUrl      = require('path').resolve();

require('dotenv').config();
// Views
app.set('view engine', 'pug');

// Body parser
app.use(body_parser.urlencoded({ extended: true }));


// app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(file_upload());
app.use(body_parser.json());

if(process.env.NODE_ENV == 'development'){
    console.log('CORS Inactive')
    app.use(cors()) // Permitimos todos los request sin importar providencia
}else {
    const whiteListURLS = configfile.security.whiteListCors; // Lista de URLs permitidas en producción, especificadas en el archivo de configuracion.
    console.log('CORS active', whiteListURLS)
    let crs = function (req, callback) {
        var corsOptions;
        if (whiteListURLS.indexOf(req.header('Origin')) !== -1) {
          corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
        } else {
          corsOptions = { origin: false } // disable CORS for this request
        }
        callback(null, corsOptions) // callback expects two parameters: error and options
    }
    app.use(cors(crs))
}

app.use(checkToken);

app.use(require('./routes/index'));

module.exports = app;