
// Incluimos modulos externos
const request = require('supertest');

// Incluimos modulos internos
const app       = require('../app');

// Conectamos a la base de datos
const connection = require('../databases').Databases.connect(["MONGODB"]);

// Mocks
const { 
    MockUser, 
} = require('./mocks');

// Incluimos controladores, modelos y schemas
const models = {
    users: require('../models/users'),
    top_coins: require('../models/top_coins'),
    auth: require('../middlewares/authentication').Auth
}

const schemas = {
    users: require('../db/schemas/users.table.js'),
    top_coins: require('../db/schemas/top_coins.table.js')
}

async function Get_Token_Test() {
    // Obtenemos el id del usuario de test
    let user = await schemas.users.find({ user_name: MockUser.user_name });
    const { _id } = user[0];

    MockUser._id = _id; // Agregamos el ID al mock

    let token = new models.auth(MockUser);
    await token.delete_old_tokens();
    return await token.create_token();
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

            expect(res.statusCode).toEqual(400);    
            expect(res.body).toBeDefined();
            expect(res.body.Success).toBeFalsy();
            done();
        });
    });
})

describe('Coins test', () => {
    describe('GET /coins', () => {
        // Obtenemos todas las monedas 
        it('should obtein all coins', async done => {
            const TOKEN = await Get_Token_Test();
            const res = await request(app)
                        .get(BASE_URL + '/coins?limit=50&offset=0')
                        .set('Accept', 'application/json')
                        .set('Authorization', 'Bearer ' + TOKEN)

            expect(res.statusCode).toEqual(200);    
            expect(res.body).toBeDefined();
            expect(res.body.Data).toBeDefined();

            // Verificamos que esten definidas las claves esperadas
            expect(Object.keys(res.body.Data[0]).sort()).toEqual(['id', 'symbol', 'price', 'image', 'last_updated', 'name'].sort());

            done();
        })
    });



    describe('PUT /top_coins/:coin_id, should be true', () => {
        it('ADD Bitcoin to top N', async done => {
            const TOKEN = await Get_Token_Test();
            const res = await request(app)
                        .put(BASE_URL + '/top_coins/bitcoin')
                        .set('Accept', 'application/json')
                        .set('Authorization', 'Bearer ' + TOKEN)

            expect(res.statusCode).toEqual(200);    
            expect(res.body).toBeDefined();
            expect(res.body.Data.length).toBe(1);

            done();
        })

        it('ADD Ethereum to top N', async done => {
            const TOKEN = await Get_Token_Test();
            const res = await request(app)
                        .put(BASE_URL + '/top_coins/ethereum')
                        .set('Accept', 'application/json')
                        .set('Authorization', 'Bearer ' + TOKEN)

            expect(res.statusCode).toEqual(200);    
            expect(res.body).toBeDefined();
            expect(res.body.Data.length).toBe(2);

            done();
        })
    });

    describe('GET /top_coins', () => {
        // Optenemos las top coins del usuario
        it('order by cotizacion DESC', async done => {
            const TOKEN = await Get_Token_Test();
            const res = await request(app)
                        .get(BASE_URL + '/top_coins?limit=25&order=DESC')
                        .set('Accept', 'application/json')
                        .set('Authorization', 'Bearer ' + TOKEN)

            expect(res.statusCode).toEqual(200);    
            expect(res.body).toBeDefined();
            expect(res.body.Data.length).toBe(2);

            // Ordenamos la respuesta y solo dejamos el id y el precio (solo en USD)
            let short_data  = res.body.Data.map(e => { return {id: e.id, price: e.prices.usd} });
            res.body.Data   = res.body.Data.map(e => { return {id: e.id, price: e.prices.usd} })
        
            // Ordenamos el array en orden descendente
            short_data = short_data.sort((a,b) => b.price - a.price);

            expect(res.body.Data).toEqual(short_data);
            done();
        })

        // Optenemos las top coins del usuario
        it('order by cotizacion ASC', async done => {
            const TOKEN = await Get_Token_Test();
            let res = await request(app)
                        .get(BASE_URL + '/top_coins?limit=25&order=ASC')
                        .set('Accept', 'application/json')
                        .set('Authorization', 'Bearer ' + TOKEN)

            expect(res.statusCode).toEqual(200);    
            expect(res.body).toBeDefined();
            expect(res.body.Data.length).toBe(2);

            // Ordenamos la respuesta y solo dejamos el id y el precio (solo en USD)
            let short_data  = res.body.Data.map(e => { return {id: e.id, price: e.prices.usd} });
            res.body.Data   = res.body.Data.map(e => { return {id: e.id, price: e.prices.usd} })
        
            // Ordenamos el array en orden ascendente
            short_data = short_data.sort((a,b) => a.price - b.price);

            expect(res.body.Data).toEqual(short_data);
            done();
        })
    });
})

afterAll(async () => {
    // Delete created user
    await models.users.delete(MockUser.user_name); // Eliminamos solo el usuario de test
    await schemas.top_coins.remove(); // Eliminamos toda la collection of top_coins
});