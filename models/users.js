/**
 * @fileoverview Model of users
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

const password_hash = require('password-hash');
const jwt           = require('jsonwebtoken');

const helper        = require('../helper');
const Sender = require('./sender');
// Models & Controllers
const controllers = {};

const models = {};

// Schemas
const schemas = {
    users: require('../db/migrations/users.table'),
    userlogin: require('../db/migrations/users_login.table'),
    roles: require('../db/migrations/roles.table'),
    permissions: require('../db/migrations/permissions.table')
};
class User {
    constructor({ name, last_name, email, password, rut, birthday, phone, role, gender}) { 
        this.name       = name          || undefined;
        this.last_name  = last_name     || undefined;
        this.email      = email         || undefined;
        this.password   = password !== undefined ? password_hash.generate(password) : undefined;
        this.rut        = rut           || undefined;
        this.birthday   = birthday      || undefined;
        this.phone      = phone         || undefined;
        this.role       = role          || undefined;
        this.gender     = gender        || undefined;
    }

    async save() {
        // Verificamos los valores requeridos
        const required_values = ["name", "last_name", "email", "role", "password", "rut"];
        const [verify, this_object] = helper.verify_object_from_array(this, required_values, ["verified", "deleted", "active"]);
        if(verify) throw new Error(verify);

        // Comprobamos la existencia del rol
        let role;
        if(this_object.role === "U0ADMIN") {
            // Significa que el rol es para el usuario 0 y buscamos el administrador

            // Consultamos si realmente es el usuario 0
            const user0 = await schemas.users.find({}).limit(50);
            if(user0.length > 0) throw new Error("Metodo valido unicamente para el usuario 0");

            // Verificamos el usuario
            this_object.verified = true;

            role = await schemas.roles.find({ name: "Administrator" });
            if(role.length === 0) throw new Error("Debe ejecutar el Seed de rol antes de crear el usuario")
            role = role[0];
            this_object.role = role._id;
        } else {
            role = await schemas.roles.find({ _id: this_object.role });
            if(role.length === 0) throw new Error("Rol inexistente");
            role = role[0];
            this_object.role = role._id;
        }

        // Comprobamos si existe el usuario con ese email
        const user_exist = await schemas.users.find({ email: this_object.email });
        if(user_exist.length > 0) throw new Error("Usuario existente");

        if(this_object.birthday) {
            this_object.birthday = helper.date_to_UTCDate(this_object.birthday);
        }

        this_object.active = true;

        let user        = new schemas.users(this_object);

        user            = await user.save();

        if(!this_object.verified) {
            const token = await helper.get_token(user._id, 'users', 'user_verify');
            const url = `https://localhost:8000/api/v1/verify?t=${token}&s=users`;
            await Sender.send_register(this_object.email, url);
        }

        if(user) return await User.get(user._id);
        else return false;
    }

    static async pwrecovery(email) {
        if(!email) throw new Error("Email invalido");

        // Consultamos si existe un usuario con ese email
        let user = await schemas.users.find({ email });
        if(user.length === 0) return true; // Retornamos true aunque es un error para confundir al usuario por cuestiones de seguridad
        user = user[0];

        // Creamos una nueva contrseña
        const new_password = email + Date.now();

        const modify = await schemas.users.updateOne({ email }, { password: password_hash.generate(new_password) });
        if(modify.ok > 0) {
            // Enviamos el mail
            await Sender.send_new_password(email, new_password);
            return true;
        } else return true;
    }

    static async delete(id) {
        if(!id) throw new Error("Error en los parametros enviados");
        
        // Buscamos si existe el usuario 
        let user = await schemas.users.find({ _id: id, deleted: false });
        if(user.length === 0) throw new Error("Usuario inexistente");
        user = user[0];

        // Eliminamos el usuario 
        const delete_query = await schemas.users.updateOne({ _id: id }, { deleted: true });
        if(delete_query.ok > 0) return true;
        else return false;
    }

    static async modify(id, data) {
        if(!id) throw new Error("Error en los parametros enviados");

        // Buscamos si existe el usuario 
        let user = await schemas.users.find({ _id: id, deleted: false });
        if(user.length === 0) throw new Error("Usuario inexistente");
        user = user[0];

        
        if(data.active !== undefined) {
            data.active = !!data.active;
        }
        if(data.verified !== undefined) {
            data.verified = !!data.verified;
        }

        if(data.password) {
            data.password = password_hash.generate(data.password);
        }

        if(data.birthday) {
            data.birthday = helper.date_to_UTCDate(data.birthday);
        }

        if(data.role) {
            data.role = await schemas.roles.find({ _id: data.role });
            if(data.role.length === 0) throw new Error("Rol inexistente");
            data.role = data.role[0];
            data.role = data.role._id;
        }


        // Modificamos el usuario
        const modify_query = await schemas.users.updateOne({ _id: id }, data);
        if(modify_query.ok > 0) {
            return await User.get(id);
        } else return false;
    }

    static async get(id, search_params = {}) {
        let where = {
            deleted: false
        }
        const limit = parseInt(search_params.limit) || 25;
        const offset = parseInt(search_params.offset) || 0;

        if(id) {
            where._id = id;
        } else {
            if(search_params.verified) {
                where.verified = search_params.verified == "false" ? false : true;
            }
            if(search_params.active) {
                where.active = search_params.active == "false" ? false : true;
            }
            if(search_params.role) { 
                where.role = search_params.role
            }
            if(search_params.q !== undefined){
                const { q } = search_params;
                if(q.includes('@')) {
                    where.email = { $regex: q, $options: 'i' }
                } else {
                    if(!where.$or){
                        where.$or = [];
                    }
    
                    where.$or.push({ name: { $regex: q, $options: 'i' } });
                    where.$or.push({ last_name: { $regex: q, $options: 'i' } });
                }
            }
        }



        const query = await schemas.users.find(where).limit(limit).skip(offset);
        const return_data = [];
        for(const { _id:id, name, last_name, verified, active, email, phone, role, rut, birthday, gender, createdAt, updatedAt } of query) {
            const rol = await schemas.roles.findById(role);
            
            let u = {
                id,
                name,
                last_name,
                verified,
                active,
                email,
                role: false,
                rut,
                birthday,
                gender,
                createdAt,
                updatedAt
            }

            if(rol) {
                u.role = rol.name
            }

            return_data.push(u);
        }
        return return_data;
    }

    static async get_loggin_user_data(user_id) {
        if(!user_id) throw new Error("Error en los parametros enviados");

        // Buscamos el usuario
        const user = await schemas.users.find({ _id: user_id, deleted: false });
        if(user.length === 0) throw new Error("Usuario inexistente");

        const { _id:id, name, last_name, active, verified, role, gender, email, phone, rut } = user[0];
        // Comprobamos si el usuario esta activo y verificado
        if(!active) throw new Error("Usuario inactivo, comuniquese con el administrador para que vuelvan a activarlo");
        if(!verified) throw new Error("Usuario no verificado, por favor verifique su email");


        // Agregamos los permisos del usuario
        let rol = await schemas.roles.find({ _id: role });
        if(rol.length === 0) throw new Error("Rol inexistente");
        let permissions = [];
        permissions = rol[0].permissions;

        if(permissions.find(elem => elem.module == 'ALL' && elem.method == 'ALL')) {
            // Obtenemos todos los permisos
            permissions = await schemas.permissions.find();
        } 

        return { id, name, last_name, role, gender, email, phone, rut, permissions };
    }

    static async checkUserPassword(email, password) {
        if(!email || !password) throw new Error("Error en los parametros enviados");

        // Buscamos si existe el usuario 
        let user = await schemas.users.find({ email, deleted: false });
        if(user.length === 0) throw new Error("Usuario inexistente");

        user = user[0];
        // Agregamos los permisos del usuario
        let rol = await schemas.roles.find({ _id: user.role });
        if(rol.length === 0) throw new Error("Rol inexistente");
        let permissions = [];
        permissions = rol[0].permissions;
        if(permissions.find(elem => elem.module == 'ALL' && elem.method == 'ALL')) {
            // Obtenemos todos los permisos
            permissions = await schemas.permissions.find();
        } 

        user.permissions = permissions;

        if(!user.active) throw new Error('Usuario bloqueado o inactivo. Comuniquese con el administrador.');

        // Consultamos si el usuario tiene permiso
        let consultaInicio = await this.checkAttemptsLogin(user);
        if(!consultaInicio) throw new Error('Debido a los intentos reiterados de inicio de sesion, su cuenta ha sido bloqueada.');
        
        let originPass = user.password;
        if(!password_hash.verify(password, originPass)) throw new Error('Contraseña Erronea');
        else {
            this.restartCountAttempts(consultaInicio);
            return user;
        };
    }

    static async send_verification_mail(userId) {
        console.log("Falta desarrollar el sender");
    }

    /**
     * Esta funcion sirve para consultar la cantidad de inicios de sesion de un usuario
     * que sumara uno al intento, o devolvera false en caso que se hayan superado los numero de intentos
     * @param {object} userID especificamos el id del usuario a verificar 
     */
    static async checkAttemptsLogin(userID) {
        // Consultamos si el usuario tiene permiso de inciar sesion
        let c = await schemas.userlogin.find({ userId: userID._id, type: 'admin' });
        let idReturn;
        if(c.length === 0) {
            // Usuario nunca inicio sesion
            c = new schemas.userlogin({
                userId: userID._id,
                type: 'admin',
                NofAttempts: 1
            });
            idReturn = c._id
            await c.save();
        }else{
            if(c[0].NofAttempts < 5){
                // Suma un intento
                await schemas.userlogin.updateOne({_id: c[0]._id}, {
                    NofAttempts: c[0].NofAttempts + 1
                })
                idReturn = c[0]._id;
            }else{
                // Inactiva el usuario
                await schemas.users.updateOne({ _id: userID._id },{
                    active: false
                })
                this.restartCountAttempts(c[0]._id);
                return false;
            }
        }
        return idReturn;
    }

    /**
     * Esta funcion volvera el contador de inicio de sesion a 0 ya que el usuario pudo
     * logearse correctamente.
     * @param {object} registerId id del registro de usuario 
     */
    static restartCountAttempts(registerId) {
        schemas.userlogin.updateOne({ _id: registerId }, {
            NofAttempts: 0
        }).then(v => {v})
    }
}

module.exports = User;