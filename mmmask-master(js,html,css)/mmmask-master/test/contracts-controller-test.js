require('should')
const contractController = require('../controllers/contracts-controller')
const bandController = require('../controllers/bands-controller')
const promoterController = require('../controllers/promoter-controller')
const concertController = require('../controllers/concert-controller')

/**
 * hasValue.
 * Returns a RegExp which escapes the value, so characters does not count as regex
 * @param {} value
 */
function hasValue(value) {
    const escapedValue = value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
    return new RegExp(escapedValue)
}

async function createConcert(promoterData, bandData, concertData) {
    const promoter = await promoterController.create(promoterData)
    const band = await bandController.create(bandData)
    concertData.promoter = promoter
    concertData.band = band
    return await concertController.create(concertData)
}

describe('contract-controller-test:', function () {
    // Concert requirements
    let promoterData, bandData, concertData

    // Contract requirements
    let paymentDetails, invoice, other, contractNumber, contractDate, ticketPrice, totalSettlement

    before(() => {
        promoterData = {
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
        bandData = {
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

        concertData = {
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

        paymentDetails =
            'Nettohonorar:\nNettohonoraret, dvs. honoraret efter provision og produktionsomkostninger er fraregnet, udbetales og indberettes til Artisten førstkommende hverdag efter koncerten jf. bank- og indberetningsoplysningerne herunder. Kontraktnummeret noteres ved bankoverførslen.\n\nProvision:\nProvisonen afregnes separat ved, at ACB Music efter endt koncert – og efter en eventuel over-skudsdeling er beregnet – fremsender en faktura på det endelige provisionsbeløb.'

        invoice = {
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

        other =
            'Arrangementet indledes med at bandet introducerer sig selv og fortæller om deres vej ind i musikken og dertil hvor de nu er nået. Herefter spiller bandet ca. 35-45 min. koncert med henblik på at slutte arrangementet med musik fremfor snak.'

        contractNumber = 'P200225'
        contractDate = '07.11.2019'

        ticketPrice = 'Gratis for inviterede'
        totalSettlement = '15.000,00 DKK'
    })

    describe('create()', function () {
        it('should return created contract', async () => {
            const concert = await createConcert(promoterData, bandData, concertData)
            const contract = await contractController.create({
                contractNumber,
                contractDate,
                concert,
                ticketPrice,
                paymentDetails,
                invoice,
                totalSettlement,
                other
            })

            contract._doc.contractNumber.should.equal(contractNumber)
            contract._doc.contractDate.should.equal(contractDate)
            contract._doc.concert._doc.should.containEql(concertData)
            contract._doc.concert._doc.promoter._doc.should.containEql(promoterData)
            contract._doc.concert._doc.band._doc.should.containEql(bandData)
            contract._doc.ticketPrice.should.equal(ticketPrice)
            contract._doc.paymentDetails.should.equal(paymentDetails)
            contract._doc.invoice.should.containEql(invoice)
            contract._doc.totalSettlement.should.equal(totalSettlement)
            contract._doc.other.should.equal(other)
        })

        it('should return error', async () => {
            try {
                await contractController.create({})
                throw new Error('Skulle aldrig ske')
            } catch (error) {
                error.name.should.be.equal('ValidationError')
                error.message.should.be.equal(
                    'Contract validation failed: concert: Path `concert` is required., contractNumber: Path `contractNumber` is required.'
                )
            }
        })
    })

    describe('getAll() gives', function () {
        it('0 when no contracts in system', async () => {
            const contracts = await contractController.getAll()
            contracts.length.should.be.equal(0)
        })

        it('should have one', async () => {
            const concert = await createConcert(promoterData, bandData, concertData)
            const contract = await contractController.create({
                contractNumber,
                contractDate,
                concert,
                ticketPrice,
                paymentDetails,
                invoice,
                totalSettlement,
                other
            })

            const contracts = await contractController.getAll()
            contracts.length.should.be.equal(1)
        })

        it('last contract should be equal to newly created', async () => {
            const concert = await createConcert(promoterData, bandData, concertData)
            const contract1 = await contractController.create({
                contractNumber,
                contractDate,
                concert,
                ticketPrice,
                paymentDetails,
                invoice,
                totalSettlement,
                other
            })

            const contract2 = await contractController.create({
                contractNumber: 'PNew123',
                contractDate,
                concert,
                ticketPrice,
                paymentDetails,
                invoice,
                totalSettlement,
                other
            })

            const contracts = await contractController.getAll()

            contracts[0].contractNumber.should.equal(contract1.contractNumber)
            contracts[1].contractNumber.should.equal(contract2.contractNumber)
            contracts.length.should.be.equal(2)
        })
    })

    // TODO: Give false positive !!
    describe('update()', function () {
        // it('should return updated contract', async () => {
        //     const contract = await controller.update(id, {
        //         contractNumber: 'P200226',
        //         totalSettlement: '1.000.000,00 DKK'
        //     })
        //     contract.contractNumber.should.be.equal('P200226')
        //     contract.totalSettlement.should.be.equal('1.000.000,00 DKK')
        // })
        it('should give error for bad id', async () => {
            try {
                const badId = 'badId'
                await contractController.update(badId, {
                    totalSettlement: '1.000.001,00 DKK'
                })
                throw new Error('Skulle aldrig ske')
            } catch (error) {
                error.name.should.be.equal('CastError')
                error.message.should.be.equal(
                    'Cast to ObjectId failed for value "badId" at path "_id" for model "Contract"'
                )
            }
        })
    })

    // TODO: Give false positive !!
    describe('delete()', function () {
        // it('should return removed contract', async () => {
        //     const contract = await controller.delete(id)
        //     contract.contractNumber.should.be.equal('P200226')
        //     contract.totalSettlement.should.be.equal('1.000.000,00 DKK')
        // })
        it('should give error for bad id', async () => {
            try {
                const badId = 'badId'
                await contractController.delete(badId)
                throw new Error('Skulle aldrig ske')
            } catch (error) {
                error.name.should.be.equal('CastError')
                error.message.should.be.equal(
                    'Cast to ObjectId failed for value "badId" at path "_id" for model "Contract"'
                )
            }
        })
    })
})
