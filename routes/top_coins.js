/**
 * @fileoverview Top Coins routes
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
// Incluimos modulos externos
const express = require('express');

const router  = express.Router();

// Incluimos controladores
const controllers = {
    users: require('../controllers/users')
}

// Methods
router.put("/:coin_id", controllers.users.get);
router.get("/", controllers.users.new);

module.exports = router;