
describe('User Tests', () => {
    it('POST /user',() => {

    })  

    it('POST /login', () => {
        // Logeamos la usuario
    })

    it('GET /user', () => {
        // Obtenemos la informacion del usuario
    })
});

describe('Coins test', () => {
    it('GET /coins', () => {
        // Obtenemos todas las monedas 
    });

    it('GET /top_coins, should be 0', () => {
        // Optenemos las top coins del usuario
    });

    it('PUT /top_coins/:coin_id', () => {
        // Agregamos una moneda a los top coins
    });

    it('GET /top_coins, should be 1', () => {
        // Optenemos las top coins del usuario
    });

    it('PUT /top_coins/:coin_id x3', () => {
        // Agregamos tres monedas a los top coins
    });

    it('GET /top_coins, should be 4 order DESC', () => {
        // Optenemos las top coins del usuario ordenadas por cotización
    });
})

beforeAll(() => {
    // Eliminamos al usuario de test 
});