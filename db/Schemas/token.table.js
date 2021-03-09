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