#!/usr/bin/env node

require('dotenv').config();
const { Databases } = require('../../databases');

const user_model = require('../../models/users');

module.exports = async function() {
    Databases.connect(['MONGODB']).then(v => {
        if(v) {
            let u = new user_model({
                name: "Ramiro",
                last_name: "Macciuci Admin 0",
                dni: "39875374",
                email: "rmdeveloptest@gmail.com",
                password: "RMDevelopTest123!",
                gender: "Masculino",
                role: "U0ADMIN"
            })

            u.save().then(v => {
                process.exit();
            })
        }
    }).catch(e => {
        console.log(e);
    });


}();