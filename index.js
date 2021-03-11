/**
 * @fileoverview Project entry file
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

// Include internal modules
const app           = require('./app');
const { Databases } = require('./databases');

require('dotenv').config();
const port              = process.env.PORT || 65000;

Databases.connect(["MONGODB"]).then(v => {
    if(v) {
        app.listen(port);
        console.log('   ')
        console.log('   ', `Servidor en funcionamiento desde el puerto ${port}`);
        console.log('   ');
    }
}).catch(e => {
    console.log("Error: ", e);
})
