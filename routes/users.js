/**
 * @fileoverview Routes for users
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
    users: require('../controllers/users')
}

// Methods
// router.get("/:id?", controllers.users.get);
// router.put("/:id?", controllers.users.modify);
// router.delete("/:id", controllers.users.delete);
// router.post("/", controllers.users.new);

module.exports = router;