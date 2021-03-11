/**
 * @fileoverview Coins routes
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
    coins: require('../controllers/coins')
}

// Routes
router.get("/", controllers.coins.get);

module.exports = router;