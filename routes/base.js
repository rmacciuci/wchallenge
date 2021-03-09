/**
 * @fileoverview Routes for base
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
const express = require('express');

const router  = express.Router();

const controllers = {
    main: require('../controllers/main'),
    users: require('../controllers/users'),
    clients: require('../controllers/clients')
}

// Methods
router.post("/login/:section", controllers.main.login);
router.post("/signup", controllers.clients.signup);
router.get("/verify", controllers.main.verify);
router.get("/futils", controllers.main.futils);
router.all("/test", controllers.main.test);
router.all("/pwrecovery", controllers.users.pwrecovery);

module.exports = router;