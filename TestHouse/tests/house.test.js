const request = require('supertest')
const app = require('../index.js')

const objectToTest = {
        "address": "Calle 0 # 00 - 00",
        "city": "Girardot",
        "state": "Cundinamarca",
        "size": 99,
        "type": "apartment",
        "zip_code": "999999",
        "rooms": 9,
        "bathrooms": 9,
        "parking": true,
        "price": 999999999,
        "code": "AAAA9999",
        }
let houseCode

describe('GET /house', () => {
    it('responds with status 200', async () => {
        const response = await request(app).get('/house');              
        expect(response.status).toBe(200);
    })

    it('responds with an array Object that contains an specific house', async () => {
        const response = await request(app).get('/house');             
        expect(Array.isArray(response.body)).toBe(true);
    })
})

describe('POST /house', () => {
    it('create a new house in the DB and response with the data', async () => {
        const response = await request(app).post('/house').send(objectToTest)
        /** Asignando el _id del usuario nuevo a la variable userId 
         *  para ser usanda en las otras pruebas */
        houseCode = response.body.code;

        expect(response.statusCode).toBe(201)
        expect(response.body).toHaveProperty('_id')

        expect(response.body.address).toBe(objectToTest.address)
        expect(response.body.city).toBe(objectToTest.city)
        expect(response.body.state).toBe(objectToTest.state)
        expect(response.body.size).toBe(objectToTest.size)
        expect(response.body.type).toBe(objectToTest.type)
        expect(response.body.zip_code).toBe(objectToTest.zip_code)
        expect(response.body.rooms).toBe(objectToTest.rooms)
        expect(response.body.bathrooms).toBe(objectToTest.bathrooms)
        expect(response.body.parking).toBe(objectToTest.parking)
        expect(response.body.price).toBe(objectToTest.price)
        expect(response.body.code).toBe(objectToTest.code)
    })
    it('The data is incorrect', async () => {
        const badObjectToTest = {
            "address": "Calle 0 # 00 - 00",
            "city": "Girardott",
            "state": "CCundinamarca",
            "size": 99,
            "type": "apartment",
            "zip_code": "999999",
            "rooms": 9,
            "bathrooms": 9,
            "parking": true,
            "price": 999999999,
            "code": "AAA19999",
            }

        const response = await request(app).post('/house').send(badObjectToTest)

        expect(response.statusCode).toBe(400)
        expect(response.body).not.toHaveProperty('_id')
        expect(response.body.status).toBe("failed")

    })

    it('The data already exists', async () => {
        const existsObjectToTest = {
            "address": "Calle 0 # 00 - 00",
            "city": "Girardot",
            "state": "Cundinamarca",
            "size": 99,
            "type": "apartment",
            "zip_code": "999999",
            "rooms": 9,
            "bathrooms": 9,
            "parking": true,
            "price": 999999999,
            "code": "AAAA9999",
            }

        const response = await request(app).post('/house').send(existsObjectToTest)

        expect(response.statusCode).toBe(409)
        expect(response.body).not.toHaveProperty('_id')
        expect(response.body.status).toBe("failed")
    })
})

describe('GET /house/:code', () => {
    it('responds with an Object that contains an specific house', async () => {
        
        const response = await request(app).get('/house/'+ houseCode);      
        expect(response.status).toBe(200);
        expect(typeof response.body === "object").toBe(true);
        expect(response.body).toHaveProperty('_id')

        expect(response.body.address).toBe(objectToTest.address)
        expect(response.body.city).toBe(objectToTest.city)
        expect(response.body.state).toBe(objectToTest.state)
        expect(response.body.size).toBe(objectToTest.size)
        expect(response.body.type).toBe(objectToTest.type)
        expect(response.body.zip_code).toBe(objectToTest.zip_code)
        expect(response.body.rooms).toBe(objectToTest.rooms)
        expect(response.body.bathrooms).toBe(objectToTest.bathrooms)
        expect(response.body.parking).toBe(objectToTest.parking)
        expect(response.body.price).toBe(objectToTest.price)
        expect(response.body.code).toBe(objectToTest.code)
    })

    it('A house that does not exist', async () => {
        
        const response = await request(app).get('/house/1111ZZZZ');   

        expect(response.status).toBe(404);
        expect(response.body).not.toHaveProperty('_id')
        expect(response.text).toContain("Not Found");        

    })

})

describe('PATCH /house/:code', () => {
    it('update house in the DB', async () => {
        const response = await request(app)
                                .patch('/house/'+ houseCode)
                                .send(objectToTest)
        
        expect(response.status).toBe(200);
        expect(typeof response.body === "object").toBe(true)
        expect(response.body).toHaveProperty('_id')

        expect(response.body.address).toBe(objectToTest.address)
        expect(response.body.city).toBe(objectToTest.city)
        expect(response.body.state).toBe(objectToTest.state)
        expect(response.body.size).toBe(objectToTest.size)
        expect(response.body.type).toBe(objectToTest.type)
        expect(response.body.zip_code).toBe(objectToTest.zip_code)
        expect(response.body.rooms).toBe(objectToTest.rooms)
        expect(response.body.bathrooms).toBe(objectToTest.bathrooms)
        expect(response.body.parking).toBe(objectToTest.parking)
        expect(response.body.price).toBe(objectToTest.price)
        expect(response.body.code).toBe(objectToTest.code)
    })

    it('update house in the DB is failed', async () => {
        const response = await request(app)
                                .patch('/house/1111ZZZZ')
                                .send(objectToTest)
        
        expect(response.status).toBe(500)
        expect(response.text).toContain("Error actualizando el registro, casa no encontrada")

    })

})

describe('POST /delete', () => {
    it('Success delete with code', async () => {        
        const response = await request(app).delete('/house/'+ houseCode)

        expect(response.statusCode).toBe(200)
        expect(response.body.status).toBe("success")
    })


    it('Failed delete with code', async () => {
        
        const response = await request(app).delete('/house/1111ZZZZ');   

        expect(response.status).toBe(500);
        expect(response.body.status).toBe("failed")   

    })
})
