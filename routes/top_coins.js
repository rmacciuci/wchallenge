/**
 * @fileoverview Top coins routes
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
const express = require('express');
const router  = express.Router();

// Include controllers
const controllers = {
    top_coins: require('../controllers/top_coins')
}

// Routes
router.put("/:coin_id", controllers.top_coins.toggle_favorite_coin);
router.get("/", controllers.top_coins.get);

module.exports = router;