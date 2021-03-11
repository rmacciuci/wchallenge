/**
 * @fileoverview Main Routes
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
// Include exteranal modules
const express = require('express');
const router  = express.Router();

// Include Controllers
const controllers = {
    main: require('../controllers/main')
}

// Routes
router.post("/login", controllers.main.login);

module.exports = router;