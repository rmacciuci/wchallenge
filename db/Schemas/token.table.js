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
 * 1.0 - Version principal
 */
// Incluimos modulos externos
const mongoose          = require('mongoose');
const Schema            = mongoose.Schema;

// Incluimos modulos internos
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