/**
 * @fileoverview Main Express.JS file
 * 
 * @version 1.0
 * 
 * 
 * @author Ramiro Macciuci <ramimacciuci@gmail.com>
 * @copyright RM Developer - Argentina
 * 
 * History:
 * First version
 */

// Include external modules
const express       = require("express");
const cors          = require('cors');
const file_upload   = require('express-fileupload');
const body_parser   = require('body-parser');
const os            = require('os');
const morgan        = require('morgan');

// Include internal modules
const { configfile } = require("./helper");
const { checkToken } = require("./middlewares/authentication");

const app = express(); // Init express
global.baseUrl      = require('path').resolve();

require('dotenv').config(); // Import .env

// Body parser
app.use(body_parser.urlencoded({ extended: true }));

app.use(file_upload());
app.use(body_parser.json());

if(process.env.NODE_ENV == 'development'){
    app.use(morgan('dev'));
    console.log('CORS Inactive')
    app.use(cors()) // Permit all request
}else {
    const whiteListURLS = configfile.security.whiteListCors; // permitted URL list
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

app.use(checkToken); // CheckToken middleware

app.use(require('./routes/index')); // Import main route file

module.exports = app;