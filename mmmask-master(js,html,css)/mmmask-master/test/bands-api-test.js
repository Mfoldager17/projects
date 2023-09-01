/* eslint-disable mocha/no-mocha-arrows */
require('should')
const request = require('supertest')
const app = require('../app')
const controller = require('../controllers/bands-controller')

async function createBand() {
    return await controller.create({
        name: 'PostTester',
        members: 'MedlemmerTest',
        companyName: 'companyNameTest',
        address: {
            streetAndNumber: 'streetAndNumberTest',
            zipCodeAndCity: 'zipCodeAndCityTest'
        },
        cvrNr: 'cvrNrTest',
        accNr: 'accNrTest',
        regNr: 'regNrTest',
        contactPerson: {
            name: 'contactPersonNameTest',
            phoneNr: 'contactPersonPhoneNrTest',
            mail: 'contactPersonMailTest'
        }
    })
}

describe('bands-api-test:', function () {
    // get endpoint
    describe('GET tests', function () {
        it("get('/api/bands')", async function () {
            await request(app).get('/api/bands').expect(200).expect('Content-Type', /json/)
        })
    })

    // post endpoint
    describe('POST tests', function () {
        it("post('/api/bands')", async function () {
            const response = await request(app)
                .post('/api/bands')
                .send({
                    name: 'PostTester',
                    members: 'MedlemmerTest',
                    cvrNr: 'cvrTest',
                    accNr: 'kontoTest',
                    regNr: 'regTest'
                })
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .expect(201)
            response.body.name.should.be.equal('PostTester')
            response.body.members.should.be.equal('MedlemmerTest')
            response.body.cvrNr.should.be.equal('cvrTest')
            response.body.accNr.should.be.equal('kontoTest')
            response.body.regNr.should.be.equal('regTest')
        })
        it("post('/api/bands') uden name", async function () {
            await request(app)
                .post('/api/bands')
                .send({
                    members: 'MedlemmerTest',
                    cvrNr: 'cvrTest',
                    accNr: 'kontoTest',
                    regNr: 'regTest'
                })
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .expect(422)
        })
    })
    // put endpoint
    describe('PUT tests', function () {
        it("put('/api/bands/:id')", async function () {
            const band = await createBand()
            const response = await request(app)
                .put('/api/bands/' + band._id)
                .send({
                    name: 'PostTester-updated',
                    members: 'MedlemmerTest-updated',
                    cvrNr: 'cvrTest-updated',
                    accNr: 'kontoTest-updated',
                    regNr: 'regTest-updated'
                })
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .expect(200)
            response.body.name.should.be.equal('PostTester-updated')
            response.body.members.should.be.equal('MedlemmerTest-updated')
            response.body.cvrNr.should.be.equal('cvrTest-updated')
            response.body.accNr.should.be.equal('kontoTest-updated')
            response.body.regNr.should.be.equal('regTest-updated')
        })

        it("put('/api/bands/:id') bad id", async function () {
            const response = await request(app)
                .put('/api/bands/' + 'bad-id')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .expect(422)
        })
    })

    // delete endpoint
    describe('DELETE tests', function () {
        it("delete('/api/bands/:id')", async function () {
            const band = await createBand()
            await request(app)
                .delete('/api/bands/' + band._id)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .expect(200)
        })

        it("delete('/api/bands/:id') bad id", async function () {
            await request(app)
                .delete('/api/bands/' + 'bad-id')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .expect(422)
        })
    })
})
