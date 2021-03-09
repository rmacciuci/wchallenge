/**
 * @fileoverview Controller of users
 * 
 * @version 1.0
 * 
 * @author Ramiro Macciuci <ramimacciuci@gmail.com>
 * @copyright RM Dev - Argentina
 * 
 * History:
 * 1.0 - Version principal
 */

// Incluimos controladores, modelos, schemas y modulos
const fs        = require('fs');

const { Auth }  = require('../middlewares/authentication');
const helper    = require('../helper');
const Views     = require('../views');

const models = {
    users: require('../models/users'),
    clients: require('../models/clients')
};

const schemas = {
    verify_tokens: require('../db/migrations/verify_tokens.table')
}

const controller = {
    login: async (req, res) => {
        const response = new Views(res);
        const { section } = req.params;
        const { email, password } = req.body;

        // Solo pedimos recaptcha si esta en produccion
        // if(process.env.ENVRIORMENT != 'development'){
        //     if(req.body.user === undefined || req.body['g-recaptcha-response'] === undefined || req.body.password === undefined){
        //         return views.error.message(res,'Error en los parametros enviados');
        //     }
        //     const recaptcha = req.body['g-recaptcha-response'];
        //     const urlGoogle = "https://www.google.com/recaptcha/api/siteverify";
        //     const SecretGoogleCaptcha = "6Lc_kQEVAAAAAC4geSN7f-zIhtK0oeZbE9nkWOFp"
            
        //     const params = new URLSearchParams();
        //     params.append('secret', SecretGoogleCaptcha);
        //     params.append('response', recaptcha);

        //     // Consultamos valides de recaptcha
        //     let googleQuery = await fetch(urlGoogle, {
        //         method: 'POST',
        //         body: params
        //     })
        //     googleQuery = await googleQuery.json();
        //     if(!googleQuery.success) return views.error.message(res,'Error con captcha de google');
        // }
        try{
            if(email === undefined || password === undefined) return response.message("Parametros no especificados");
            let consulta;
            if(section === 'admin') {
                consulta = await models.users.checkUserPassword(email, password);
            } else if(section === 'app') {
                consulta = await models.clients.checkUserPassword(email, password);
                // Verificamos si tiene un plan activo
                let [ active_teacher_account, , teacher_available_services ] = await require('../modules/plans/models/contracts').check_plan_of_teacher(consulta._id);
                
                consulta.active_teacher_account       = active_teacher_account;
                consulta.teacher_available_services   = teacher_available_services;
            } else return response.message("Error en los parametros del login ingresados");
            // Asignamos Token
            if(consulta) {
                const { _id, email, name, lastName, verified } = consulta;
                // si no se verifico reenviamos el mail
                if(!verified) {
                    if (consulta == 'admin') await models.users.send_verification_mail(_id);
                    else await models.clients.send_verification_mail(_id);
                    return response.message("Se reenvio el mail para que pueda verificar su cuenta");
                }
            }
            let token = new Auth(consulta, section);
            // Eliminamos los tokens vencidos y solo se aceptan N cantidad de sesiones especificadas en el setting
            await token.delete_old_tokens();

            // Creamos un nuevo token
            token = await token.create_token();

            if(!token) return response.message('Error al generar el token');
            else return response.custom_response(202, true, "Usuario logeado correctamente", {}, Views.get_loggedUser_object(consulta, token));
        }catch (e) {    
            console.log(e);
            return response.message(e.message);
        }
    },
    verify: async (req, res) => {
        const { t:token, s:section } = req.query;
        const response = new Views(res);
        if(!token || !section) return response.message("Error en los parametros enviados");

        // Buscamos el token en la tabla
        let verify_register = await schemas.verify_tokens.find({ token, section });
        if(verify_register.length === 0) return response.message("El token ya fue utilizado");
        const { userId, onVerify, _id } = verify_register[0];

        switch(onVerify) {
            case 'user_verify': 
                await models.users.modify(userId, { verified: true });
            break;
            case 'client_verify': 
                await models.clients.modify(userId, { verified: true });
            break;
        }

        // eliminamos el token
        await schemas.verify_tokens.deleteOne({ _id });

        res.redirect(301, helper.configfile.redirect_urls.success);
    },
    futils: async (req, res) => {
        const futils = JSON.parse(fs.readFileSync('./db/json/futils.json'));

        const response = new Views(res);

        return response.get(futils, "Front utilities");
    },
    test: (req, res) => {
        const response = new Views(res);


        return response.message("La API Responde correctamente al test", true);
    }
}

module.exports = controller;