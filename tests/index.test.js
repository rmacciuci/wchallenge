// Incluimos modulos externos
const request = require('supertest');

// Incluimos modulos internos
const app       = require('../app');

// Conectamos a la base de datos
const connection = require('../databases').Databases.connect(["MONGODB"]);

// Mocks
const { 
    MockUser, 
    MockLogin,
    MockToken,
    MockCreateUser
} = require('./mocks');

// Incluimos controladores, modelos y schemas
const models = {
    users: require('../models/users')
}

const BASE_URL = '/api/v1';

describe('User Tests', () => {
    describe('POST /user', () => {
        it('should be true (unique user)', async (done) => {
            // Creamos el usuario y lo eliminamos 
            const res = await request(app)
                        .post(BASE_URL + '/user')
                        .send(MockUser)
                        .set('Accept', 'application/json')
                        .expect(200)

            expect(res.statusCode).toEqual(200);    
            expect(res.body).toBeDefined();
            expect(res.body.Data).toBeDefined();
            done();
        });

        it('should be false (unique user)', async (done) => {
            // Creamos el usuario y lo eliminamos 
            const res = await request(app)
                        .post(BASE_URL + '/user')
                        .send(MockUser)
                        .set('Accept', 'application/json')
                        .expect(400)

            expect(res.statusCode).toEqual(400);    
            expect(res.body).toBeDefined();
            expect(res.body.Success).toBeFalsy();
            done();
        });
    });

    describe('GET /user', () => {
        it('should be true', async done => {
            const res = await request(app)
                            .get(BASE_URL + '/user')
                            .send({})
                            .set('Accept', 'application/json')
                            .expect(200)

            console.log(res.body)

            expect(res.statusCode).toEqual(200);    
            expect(res.body).toBeDefined();
            expect(res.body.Data).toBeDefined();
            done();
        });
    });

    afterAll(async done => {
        // Delete created user
        await models.users.delete(MockUser.user_name);
        done();
    });
})

// describe('Coins test', () => {
//     it('GET /coins', () => {
//         // Obtenemos todas las monedas 
//     });

//     it('GET /top_coins, should be 0', () => {
//         // Optenemos las top coins del usuario
//     });

//     it('PUT /top_coins/:coin_id', () => {
//         // Agregamos una moneda a los top coins
//     });

//     it('GET /top_coins, should be 1', () => {
//         // Optenemos las top coins del usuario
//     });

//     it('PUT /top_coins/:coin_id x3', () => {
//         // Agregamos tres monedas a los top coins
//     });

//     it('GET /top_coins, should be 4 order DESC', () => {
//         // Optenemos las top coins del usuario ordenadas por cotización
//     });
// })
