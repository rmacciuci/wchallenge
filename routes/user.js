/**
 * @fileoverview Users routes
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
const express = require('express');
const router  = express.Router();

// Include controllers
const controllers = {
    users: require('../controllers/users')
}

// Routes
router.get("/", controllers.users.get);
router.post("/", controllers.users.new);

module.exports = router;