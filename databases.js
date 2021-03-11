/**
 * @fileoverview Database connections
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
const mongoose  = require('mongoose');
mongoose.Promise = global.Promise;

const Databases = {
    connections: [],
    async connect(db_names) {
        // Get a connections data from .ENV file
        if(db_names.includes('MONGODB')){
            let { MONGODB_HOST:host, MONGODB_USER:user, MONGODB_PASS:pass, MONGODB_PORT:port, MONGODB_DB:db } = process.env;
            if(!host || !user || !pass || !db) throw new Error('undefined database parameters');

            if(!port) { port = 27017; }

            let c = new Mongo(port, host, user, pass, db);
            c = await c.connect();
            if(c) {
                this.connections.push(["MongoDB", port, db])
            }
        }
        this.logMessages()
        return true;
    },
    /** This function return a log message in console from database connection status */
    logMessages() {
        console.log('--------------- DATABASE CONNECTIONS ---------------')
        console.log('   ');
        for(let c = 0; c < this.connections.length; c++) {
            const [ type, port, database ] = this.connections[c];
            console.log(`${c + 1}.   Tipo: ${type} || Puerto: ${port} || DB: ${database}`);
            console.log('   ');
        }
        console.log('-----------------------------------------------------')
    }
}

class Mongo {
    constructor(port, host, user, pass, database) {
        this.port       = port      || false;
        this.host       = host      || false;
        this.user       = user      || '';
        this.pass       = pass      || '';
        this.database   = database  || false;
    }

    async connect() {
        if(!this.port || !this.host || !this.user) throw new Error('Error en los datos enviados a la conexión');
        const url = `mongodb://${this.host}:${this.port}/${this.database}`;
        const configs = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }
        try {
            const connection = await mongoose.connect(url, configs);
            return connection;
        } catch (e) {
            console.log('Error de conexion a mongodb');
            throw e;
        }
    }
}

module.exports = {
    Databases
}