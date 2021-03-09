/**
 * @fileoverview Users routes
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
router.get("/", controllers.users.get);
// router.put("/:id?", controllers.users.modify);
// router.delete("/:id", controllers.users.delete);
router.post("/", controllers.users.new);

module.exports = router;