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
    user_id: {
        type: String,
        required: true
    },
    coin_id: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model(helper.getDatabaseName('top_coins'), table);