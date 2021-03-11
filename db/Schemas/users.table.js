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
// Include external modules
const mongoose          = require('mongoose');
const Schema            = mongoose.Schema;

// Include internal modules
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
        enum: ["usd", "ars", "eur"]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model(helper.getDatabaseName('users'), table);