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
    top_coins: require('../controllers/top_coins')
}

// Methods
router.put("/:coin_id", controllers.top_coins.toggle_favorite_coin);
router.get("/", controllers.top_coins.get);

module.exports = router;