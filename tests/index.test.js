// Global settings
jest.setTimeout(30000);

// Include external modules
const request = require('supertest');

// Include internal modules
const app       = require('../app');

// Connect to mongodb
require('../databases').Databases.connect(["MONGODB"]);

// Mocks
const { MockUser } = require('./mocks');

// Include Controllers, Models & Schemas
const models = {
    users: require('../models/users'),
    top_coins: require('../models/top_coins'),
    auth: require('../middlewares/authentication').Auth
}

const schemas = {
    users: require('../db/schemas/users.table.js'),
    top_coins: require('../db/schemas/top_coins.table.js')
}

/** This function return a valid token */
const Get_Token_Test = jest.fn( async () => {
    // Obtenemos el id del usuario de test
    let user = await schemas.users.find({ user_name: MockUser.user_name });
    const { _id } = user[0];

    MockUser._id = _id; // Add user id to mock object

    let token = new models.auth(MockUser);
    await token.delete_old_tokens();
    return await token.create_token();
})

console.log = jest.fn(); // delete console.log to read the cleaner result 

const BASE_URL = '/api/v1'; // Endpoints base URL.

describe('User Tests', () => {
    describe('POST /user (signup)', () => {
        it('should be true (unique user)', async (done) => {
            const res = await request(app)
                        .post(BASE_URL + '/user')
                        .send(MockUser)
                        .set('Accept', 'application/json')

            expect(res.statusCode).toEqual(200);    
            expect(res.body).toBeDefined();
            expect(res.body.Data).toBeDefined();

            done();
        });
    });
})

describe('Coins test', () => {
    describe('GET /coins', () => {
        // Get all coins
        it('should obtein all coins', async done => {
            const TOKEN = await Get_Token_Test();
            const res = await request(app)
                        .get(BASE_URL + '/coins?limit=50&offset=0')
                        .set('Accept', 'application/json')
                        .set('Authorization', 'Bearer ' + TOKEN)

            expect(res.statusCode).toEqual(200);    
            expect(res.body).toBeDefined();
            expect(res.body.Data).toBeDefined();

            // Verify that the required schema by Wolox is defined
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
        // Get users top coins
        it('order by cotizacion DESC', async done => {
            const TOKEN = await Get_Token_Test();
            const res = await request(app)
                        .get(BASE_URL + '/top_coins?limit=25&order=DESC')
                        .set('Accept', 'application/json')
                        .set('Authorization', 'Bearer ' + TOKEN)

            expect(res.statusCode).toEqual(200);    
            expect(res.body).toBeDefined();
            expect(res.body.Data.length).toBe(2);

            // response sort and filter id and price (only in USD)
            let short_data  = res.body.Data.map(e => { return {id: e.id, price: e.prices.usd} });
            res.body.Data   = res.body.Data.map(e => { return {id: e.id, price: e.prices.usd} })
        
            // Sort desc array
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

            // response sort and filter id and price (only in USD)
            let short_data  = res.body.Data.map(e => { return {id: e.id, price: e.prices.usd} });
            res.body.Data   = res.body.Data.map(e => { return {id: e.id, price: e.prices.usd} })
        
            // Sort asc array
            short_data = short_data.sort((a,b) => a.price - b.price);

            expect(res.body.Data).toEqual(short_data);
            done();
        })
    });
})

afterAll(async () => {
    // Delete created user
    await schemas.users.deleteMany({}); // Drop users collection
    await schemas.top_coins.deleteMany({}); // Drop top_coins collection
});