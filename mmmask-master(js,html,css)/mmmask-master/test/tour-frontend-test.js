require('should')
const request = require('supertest')
const app = require('../app')
const controllerTour = require('../controllers/tour-controller')
const bandController = require('../controllers/bands-controller')
const controllerPromoter = require('../controllers/promoter-controller')
const controllerVenue = require('../controllers/venue-controller')
const controllerConcert = require('../controllers/concert-controller')

/**
 * hasValue.
 * Returns a RegExp which escapes the value, so characters does not count as regex
 * @param {} value
 */
function hasValue(value) {
    const escapedValue = value.replace(/[$()*+./?[\\\]^{|}-]/gu, '\\$&')
    return new RegExp(escapedValue)
}

const bandData = {
    name: 'Babuskina',
    companyName: 'Babuskina I/S',
    members: 'Guitarist, basist og vokal',
    cvrNr: '1921',
    accNr: '8159700934',
    regNr: '0815',
    address: {
        streetAndNumber: 'Møtrikvej 32',
        zipCodeAndCity: '8000 Aarhus'
    },
    contactPerson: {
        name: 'Anders Büchart',
        phoneNr: '20 30 48 06',
        mail: 'anders@abcmusic.dk'
    }
}

const concertDate = '2021-01-01'
const venue1Data = {
    name: 'Spillerens Stedss',
    address: { streetAndNumber: 'Hellebellevej 28ss', zipCodeAndCity: '3939 Bullerby' }
}

async function createConcert(band) {
    const promoter = await controllerPromoter.create({
        name: 'Test Promoter'
    })

    return await controllerConcert.create({
        promoter: promoter._id,
        band: band._id,
        venue: {
            name: 'venueNavn',
            address: {
                streetAndNumber: 'Vej 1',
                zipCodeAndCity: '8000 Aarhus'
            }
        },
        time: {
            date: concertDate,
            start: '20:00',
            duration: '60 min.'
        },
        capacity: '500',
        memo: '7 tariffer + provision',
        state: 'TODO'
    })
}

async function create() {
    const band = await bandController.create(bandData)
    const venue1 = await controllerVenue.create(venue1Data)
    const venue2 = await controllerVenue.create({
        name: 'Hovedstedets Spillerss',
        address: { streetAndNumber: 'Den Rigtige Vej 37', zipCodeAndCity: '1000 Staden' }
    })

    const tourDay1 = {
        date: '06/11/2020',
        note: 'Peter kan ikke køre bussen'
    }
    const tourDay2 = {
        concert: (await createConcert(band))._id,
        note: 'næsten afsluttet'
    }

    const tour = await controllerTour.create({
        name: 'PATINA – 2020',
        band: band._id,
        tourDays: [tourDay1, tourDay2],
        bruttoList: [venue1._id, venue2._id]
    })

    return tour
}

// Template
describe('tour-frontend-test', function () {
    describe('visiting /tours', function () {
        it('to see list of tours/tour added', async function () {
            const tour = await create()
            const response = await request(app).get('/tours').expect(200).expect('Content-Type', /html/)

            response.text.search(hasValue(tour.name)).should.be.greaterThan(0)
            response.text.search(hasValue(bandData.name)).should.be.greaterThan(0)
        })
    })

    describe('visiting /tours/:id', function () {
        it("get('/tours/:id') should contain info of added tour", async function () {
            const tour = await create()
            const response = await request(app)
                .get('/tours/' + tour._id)
                .expect(200)
                .expect('Content-Type', /html/)

            response.text.search(hasValue(tour.name)).should.be.greaterThan(0)

            response.text.search(hasValue(tour.tourDays[0].date)).should.be.greaterThan(0)
            response.text.search(hasValue(tour.tourDays[0].note)).should.be.greaterThan(0)

            response.text.search(hasValue(concertDate)).should.be.greaterThan(0)
            response.text.search(hasValue(tour.tourDays[1].note)).should.be.greaterThan(0)

            response.text.search(hasValue(venue1Data.name)).should.be.greaterThan(0)
            response.text.search(hasValue(venue1Data.address.streetAndNumber)).should.be.greaterThan(0)
        })
    })
})
