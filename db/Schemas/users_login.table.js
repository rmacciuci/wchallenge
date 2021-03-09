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
 * 1.0 - Version principalp
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
    NofAttempts: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model(helper.getDatabaseName('users_login'), table);