/**
 * @fileoverview Tokens Schema
 *
 * @version 1.0
 *
 * 
 * @author Ramiro Macciuci <ramimacciuci@gmail.com>
 * @copyright Ramiro Macciuci - Argentina
 *
 * History:
 * First version
 */
// Include external modules
const mongoose          = require('mongoose');
const Schema            = mongoose.Schema;

// Include internal modules
const helper            = require("../../helper");

const table = new Schema({
    userId: {
        type: String,
        required: true
    },
    sessionId: {
        type: String,
        required: true,
        unique: true
    },
    token: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model(helper.getDatabaseName('tokens'), table);