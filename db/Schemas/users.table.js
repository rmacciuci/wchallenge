/**
 * @fileoverview Users Schema
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
// Incluimos modulos externos
const mongoose          = require('mongoose');
const Schema            = mongoose.Schema;

// Incluimos modulos internos
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