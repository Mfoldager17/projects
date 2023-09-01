require('should')
const request = require('supertest')
const app = require('../app')
const controller = require('../controllers/venue-controller')

describe('venue frontend test', function () {
    let venue

    beforeEach(async function () {
        venue = await controller.create({
            name: 'Test Venue',
            address: {
                streetAndNumber: 'Test Address',
                zipAndCity: '1324 Test City'
            }
        })
    })

    it('see input in creating venue page', async function () {
        const res = await request(app)
            .get('/venues/create')
            .accept('Accept', 'application/html')
            .expect('Content-Type', /html/)
            .expect(200)

        res.text.search(/id="name"/).should.be.greaterThan(0)
        res.text.search(/id="street"/).should.be.greaterThan(0)
        res.text.search(/id="zipAndCity"/).should.be.greaterThan(0)
    })

    it('see values when updating venue', async function () {
        const res = await request(app)
            .get('/venues/' + venue._id)
            .accept('Accept', 'application/html')
            .expect('Content-Type', /html/)
            .expect(200)

        res.text.search(/Test Venue/).should.be.greaterThan(0)
        res.text.search(/Test Address/).should.be.greaterThan(0)
        res.text.search(/1324 Test City/).should.be.greaterThan(0)
    })

    it('see more than one venue', async function () {
        await controller.create({
            name: 'New Venue',
            address: {
                streetAndNumber: 'New Address',
                zipAndCity: '2233 New City'
            }
        })

        const res = await request(app)
            .get('/venues/')
            .accept('Accept', 'application/html')
            .expect('Content-Type', /html/)
            .expect(200)

        res.text.search(/Test Venue/).should.be.greaterThan(0)
        res.text.search(/New Venue/).should.be.greaterThan(0)
    })
})
