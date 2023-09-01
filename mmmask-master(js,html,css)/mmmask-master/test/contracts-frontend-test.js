require('should')
const request = require('supertest')
const app = require('../app')
const controller = require('../controllers/contracts-controller')
const bandController = require('../controllers/bands-controller')
const concertController = require('../controllers/concert-controller')
const promoterController = require('../controllers/promoter-controller')

/**
 * hasValue.
 * Returns a RegExp which escapes the value, so characters does not count as regex
 * @param {} value
 */
function hasValue(value) {
    const escapedValue = value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
    return new RegExp(escapedValue)
}

async function create() {
    const promoterData = {
        name: 'Den Eneste Private Realskole',
        address: {
            streetAndNumber: 'Markvej 17',
            zipCodeAndCity: '9600 Aars'
        },
        contactPerson: {
            name: 'Att. Lars Peterson',
            phoneNr: '+45 18 40 18 40',
            mail: 'skole@rektor.dk'
        }
    }

    const promoter = await promoterController.create(promoterData)

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
    const band = await bandController.create(bandData)

    const concertData = {
        promoter: promoter,
        band: band,
        venue: {
            name: 'Ford',
            address: {
                streetAndNumber: 'Søndermarkvej 10',
                zipCodeAndCity: '6818 Årre'
            }
        },
        time: {
            date: '2021-01-01',
            start: '20:00',
            duration: '60 min.'
        },
        capacity: '200 i alt - 150 stående, 50 siddene på balkon',
        memo: '3 tariffer + provision',
        state: 'blyant'
    }

    const concert = await concertController.create(concertData)

    const paymentDetails =
        'Nettohonorar:\nNettohonoraret, dvs. honoraret efter provision og produktionsomkostninger er fraregnet, udbetales og indberettes til Artisten førstkommende hverdag efter koncerten jf. bank- og indberetningsoplysningerne herunder. Kontraktnummeret noteres ved bankoverførslen.\n\nProvision:\nProvisonen afregnes separat ved, at ACB Music efter endt koncert – og efter en eventuel over-skudsdeling er beregnet – fremsender en faktura på det endelige provisionsbeløb.'

    const invoice = {
        economy: {
            netFees: '92.000,00 DKK',
            productionCosts: '0,00 DKK + moms',
            commision: '2.000,00 DKK + moms',
            negotiatedPrice: '94.000,00 DKK'
        },
        settlementArtist: {
            netFees: '92.000,00 DKK',
            productionCosts: '0,00 DKK',
            plusVat: '0,00 DKK',
            totalSettlement: '92.000,00 DKK'
        },
        settlementAgency: {
            commision: '2.000,00 DKK + moms',
            plusVat: '450,00 DKK',
            totalSettlement: '2.450,00 DKK'
        }
    }

    const other =
        'Arrangementet indledes med at bandet introducerer sig selv og fortæller om deres vej ind i musikken og dertil hvor de nu er nået. Herefter spiller bandet ca. 35-45 min. koncert med henblik på at slutte arrangementet med musik fremfor snak.'

    return await controller.create({
        contractNumber: 'P200225',
        contractDate: '07.11.2019',
        concert: concert,
        ticketPrice: 'Gratis for inviterede',
        paymentDetails: paymentDetails,
        invoice: invoice,
        totalSettlement: '15.000,00 DKK',
        other: other
    })
}

describe('contract-frontend-test', function () {
    describe('visiting /contracts i assume', function () {
        it('to see promoters and artists of added contracts', async function () {
            const contract = await create()
            const response = await request(app).get('/contracts').expect(200).expect('Content-Type', /html/)

            response.text.search(hasValue(contract.concert.promoter.name)).should.be.greaterThan(0)
            response.text.search(hasValue(contract.concert.band.name)).should.be.greaterThan(0)
            response.text.search(hasValue(contract.concert.venue.name)).should.be.greaterThan(0)
        })

        it("get('/bands/edit?id=:id') should contain info of added band", async () => {
            const contract = await create()
            const res = (
                await request(app)
                    .get('/contracts/' + contract._id)
                    .expect(200)
                    .expect('Content-Type', /html/)
            ).text
            res.search(hasValue(contract.contractNumber)).should.be.greaterThan(0)
            res.search(hasValue(contract.contractDate)).should.be.greaterThan(0)
            // res.search(hasValue(contract.concert)).should.be.greaterThan(0)
            res.search(hasValue(contract.ticketPrice)).should.be.greaterThan(0)
            res.search(hasValue(contract.paymentDetails)).should.be.greaterThan(0)
            // res.search(hasValue(contract.invoice)).should.be.greaterThan(0)
            res.search(hasValue(contract.totalSettlement)).should.be.greaterThan(0)
            res.search(hasValue(contract.other)).should.be.greaterThan(0)
        })
    })
})
