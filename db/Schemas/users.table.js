/**
 * @fileoverview Database for app users
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

const mongoose          = require('mongoose');
const Schema            = mongoose.Schema;

const helper            = require("../../helper");

const table = new Schema({
    name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true,
    },
    user_name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    preferred_currency: {
        type: String,
        enum: ["USD", "ARG", "EUR"]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model(helper.getDatabaseName('users'), table);