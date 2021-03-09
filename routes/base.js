/**
 * @fileoverview Main Routes
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
    main: require('../controllers/main')
}

// Methods
router.post("/login", controllers.main.login);

module.exports = router;