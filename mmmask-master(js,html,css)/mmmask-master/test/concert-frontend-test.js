require('should')
const request = require('supertest')
const app = require('../app')
const bandController = require('../controllers/bands-controller')
const concertController = require('../controllers/concert-controller')
const promoterController = require('../controllers/promoter-controller')

describe('concerts-frontend-test', function () {
    let concert
    let band
    let promoter

    beforeEach(async function createband() {
        const bandData = {
            name: 'Band',
            companyName: 'Virksomhed',
            members: 'Medlem 1, Medlem 2',
            cvrNr: '75645678',
            accNr: '4536255879',
            regNr: '1234',
            address: {
                streetAndNumber: 'Gade1',
                zipCodeAndCity: '2222 Viby'
            },
            contactPerson: {
                name: 'Kontakt Person',
                phoneNr: '64 53 65 26',
                mail: 'kontakt_person@mail.com'
            }
        }

        const promoterData = {
            name: 'Arangør',
            address: {
                streetAndNumber: 'Gade 23',
                zipCodeAndCity: '4444 Aarhus'
            },
            contactPerson: {
                name: 'Promoters Navn',
                phoneNr: '43 56 78 90',
                mail: 'promoter.name@mail.com'
            }
        }

        band = await bandController.create(bandData)
        promoter = await promoterController.create(promoterData)

        concert = await concertController.create({
            promoter: promoter._id,
            band: band._id,
            venue: {
                name: 'Spillested',
                address: {
                    streetAndNumber: 'Spillestedets gade',
                    zipCodeAndCity: '4545 Horsens'
                }
            },
            time: {
                date: '24.12.2020',
                start: 'kl.20:00',
                duration: '2 timer'
            },
            capacity: '500',
            memo: 'Kommentar',
            state: ''
        })
    })

    it('see input in creating concert page', async function () {
        const res = await request(app)
            .get('/concerts/create')
            .accept('Accept', 'application/html')
            .expect('Content-Type', /html/)
            .expect(200)

        res.text.search(/id="bands"/).should.be.greaterThan(0)
        res.text.search(/id="promoters"/).should.be.greaterThan(0)
        res.text.search(/id="venue"/).should.be.greaterThan(0)
        res.text.search(/id="date"/).should.be.greaterThan(0)
        res.text.search(/id="time"/).should.be.greaterThan(0)
        res.text.search(/id="duration"/).should.be.greaterThan(0)
        res.text.search(/id="capacity"/).should.be.greaterThan(0)
    })

    it('see values when updating concert', async function () {
        const res = await request(app)
            .get('/concerts/' + concert._id)
            .accept('Accept', 'application/html')
            .expect('Content-Type', /html/)
            .expect(200)

        res.text.search(/Spillested/).should.be.greaterThan(0)
        res.text.search(/Spillestedets gade/).should.be.greaterThan(0)
        res.text.search(/4545 Horsens/).should.be.greaterThan(0)
        res.text.search(/24.12.2020/).should.be.greaterThan(0)
        res.text.search(/kl.20:00/).should.be.greaterThan(0)
        res.text.search(/2 timer/).should.be.greaterThan(0)
        res.text.search(/Kommentar/).should.be.greaterThan(0)
        res.text.search(/500/).should.be.greaterThan(0)
    })

    it('see more than one concert', async function () {
        newConcert = await concertController.create({
            promoter: promoter,
            band: band,
            venue: {
                name: 'nytSpillested',
                address: {
                    streetAndNumber: 'Nyt spillesteds gade',
                    zipCodeAndCity: '4545 Aalborg'
                }
            },
            time: {
                date: '02.12.2020',
                start: 'kl.18:00',
                duration: '1 time'
            },
            capacity: '100',
            memo: 'En lang kommentar',
            state: 'Blyant'
        })

        const res = await request(app)
            .get('/concerts')
            .accept('Accept', 'application/html') // hmm
            .expect('Content-Type', /html/)
            .expect(200)

        res.text.search(/24.12.2020/).should.be.greaterThan(0)
        res.text.search(/02.12.2020/).should.be.greaterThan(0)
        res.text.search(/Spillested/).should.be.greaterThan(0)
        res.text.search(/nytSpillested/).should.be.greaterThan(0)
        res.text.search(/Blyant/).should.be.greaterThan(0)
    })

    it('check selections', async function () {
        const res = await request(app)
            .get('/concerts')
            .accept('Accept', 'application/html') // hmm
            .expect('Content-Type', /html/)
            .expect(200)

        res.text.search(/Vælg band:/).should.be.greaterThan(0)
        res.text.search(/Vælg status:/).should.be.greaterThan(0)
        res.text.search(/select/).should.be.greaterThan(3)
        res.text.search(/blyant/).should.be.greaterThan(0)
        res.text.search(/confirmed/).should.be.greaterThan(0)
    })
})
