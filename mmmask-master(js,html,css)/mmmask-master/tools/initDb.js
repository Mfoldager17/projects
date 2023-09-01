const faker = require('faker')

const controllerBand = require('../controllers/bands-controller')
const controllerPromoter = require('../controllers/promoter-controller')
const controllerContract = require('../controllers/contracts-controller')
const controllerConcert = require('../controllers/concert-controller')
const controllerUser = require('../controllers/users-controller')
const controllerTour = require('../controllers/tour-controller')
const controllerStandard = require('../controllers/standard-controller')
const controllerInvoice = require('../controllers/invoice-controller')
const controllerVenue = require('../controllers/venue-controller')

const Band = require('../models/band-model')
const Concert = require('../models/concert-model')
const Promoter = require('../models/promoter-model')
const Contract = require('../models/contract-model')
const User = require('../models/user-model')
const Tour = require('../models/tour-model')
const Standard = require('../models/invoice-standard-model')
const Invoice = require('../models/invoice-model')
const Venue = require('../models/venue-model')

async function emptyDb() {
    await Band.deleteMany()
    await Concert.deleteMany()
    await Promoter.deleteMany()
    await Contract.deleteMany()
    await User.deleteMany()
    await Tour.deleteMany()
    await Standard.deleteMany()
    await Invoice.deleteMany()
    await Venue.deleteMany()
}

let band
let promoter
let venue
let concert
let contract
let tour
let standard

async function createPromoter() {
    return await controllerPromoter.create({
        name: faker.company.companyName(),
        address: {
            streetAndNumber: faker.address.streetAddress(),
            zipCodeAndCity: faker.address.zipCode() + ' ' + faker.address.city()
        },
        contactPerson: {
            name: faker.name.firstName() + ' ' + faker.name.lastName(),
            phoneNr: faker.phone.phoneNumber(),
            mail: faker.internet.email()
        }
    })
}

async function createBand() {
    return await controllerBand.create({
        name: faker.company.companyName(),
        members:
            faker.name.firstName() +
            ' ' +
            faker.name.lastName() +
            ', ' +
            faker.name.firstName() +
            ' ' +
            faker.name.lastName(),
        companyName: faker.company.companyName(),
        address: {
            streetAndNumber: faker.address.streetAddress(),
            zipCodeAndCity: faker.address.zipCode() + ' ' + faker.address.city()
        },
        cvrNr: faker.finance.iban(),
        accNr: faker.finance.routingNumber(),
        regNr: faker.finance.account(),
        contactPerson: {
            name: faker.name.firstName() + ' ' + faker.name.lastName(),
            phoneNr: faker.phone.phoneNumber(),
            mail: faker.internet.email()
        }
    })
}

async function initVenue() {
    venue = await controllerVenue.create({
        name: 'Spillerens Sted',
        address: { streetAndNumber: 'Hellebellevej 28', zipAndCity: '3939 Bullerby' }
    })
}

async function createConcert() {
    const promoters = await controllerPromoter.getAll()
    const promoter = promoters[faker.random.number(999) % promoters.length]

    const bands = await controllerBand.getAll()
    const band = bands[faker.random.number(999) % bands.length]

    return await controllerConcert.create({
        promoter: promoter,
        band: band,
        venue: {
            name: faker.company.companyName(),
            address: {
                streetAndNumber: faker.address.streetAddress(),
                zipCodeAndCity: faker.address.zipCode() + ' ' + faker.address.city()
            }
        },
        time: {
            // date: faker.date.future(),
            date: '2021-01-01',
            start: faker.time.recent(),
            duration: faker.random.number({ min: 15, max: 120 }) + ' min.'
        },
        capacity: faker.random.number({ min: 50, max: 5000 }),
        memo: faker.random.number({ min: 1, max: 20 }) + ' tariffer + provision',
        state: 'blyant'
    })
}

async function createContract() {
    const paymentDetails = 'Nettohonorar:\n' + faker.lorem.sentence(10, 50)
    const other = 'Arrangementet ' + faker.lorem.sentence(10, 50)

    const fee = faker.random.number({ min: 50000, max: 1000000 })

    const invoice = {
        economy: {
            netFees: fee + ' DKK',
            productionCosts: '0,00 DKK + moms',
            commision: fee * 0.1 + ' DKK + moms',
            negotiatedPrice: fee * 1.1 + ' DKK'
        },
        settlementArtist: {
            netFees: fee + ' DKK',
            productionCosts: '0,00 DKK',
            plusVat: '0,00 DKK',
            totalSettlement: fee * 1.1 + ' DKK'
        },
        settlementAgency: {
            commision: fee * 0.1 + ' DKK + moms',
            plusVat: fee * 0.1 * 0.25 + ' DKK',
            totalSettlement: fee * 0.1 * 0.25 + fee * 0.1 + ' DKK'
        }
    }

    const concerts = await controllerConcert.getAll()
    const concert = concerts[faker.random.number(999) % concerts.length]

    contract = await controllerContract.create({
        contractNumber: 'P' + faker.random.number(99999),
        contractDate: '07.11.2019',
        concert: concert._id,
        ticketPrice: 'Gratis for inviterede',
        paymentDetails: paymentDetails,
        invoice: invoice,
        totalSettlement: fee * 1.1 + ' DKK',
        other: other
    })
}

async function initConcert() {
    concert = await controllerConcert.create({
        promoter: promoter._id,
        band: band._id,
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
    })

    await createConcert()
    await createConcert()
}

async function initBand() {
    band = await controllerBand.create({
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
    })

    await createBand()
    await createBand()
}

async function initPromoters() {
    promoter = await controllerPromoter.create({
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
    })

    await createPromoter()
    await createPromoter()
}

async function initPromoters() {
    promoter = await controllerPromoter.create({
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
    })

    await createPromoter()
    await createPromoter()
}

async function initContract() {
    const P200225paymentDetails =
        'Nettohonorar:\nNettohonoraret, dvs. honoraret efter provision og produktionsomkostninger er fraregnet, udbetales og indberettes til Artisten førstkommende hverdag efter koncerten jf. bank- og indberetningsoplysningerne herunder. Kontraktnummeret noteres ved bankoverførslen.\n\nProvision:\nProvisonen afregnes separat ved, at ACB Music efter endt koncert – og efter en eventuel over-skudsdeling er beregnet – fremsender en faktura på det endelige provisionsbeløb.'
    const P200225other =
        'Arrangementet indledes med at bandet introducerer sig selv og fortæller om deres vej ind i musikken og dertil hvor de nu er nået. Herefter spiller bandet ca. 35-45 min. koncert med henblik på at slutte arrangementet med musik fremfor snak.'

    const P200225invoice = {
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

    contract = await controllerContract.create({
        contractNumber: 'P200225',
        contractDate: '07.11.2019',
        promoter: promoter._id,
        artist: band._id,
        concert: concert._id,
        ticketPrice: 'Gratis for inviterede',
        paymentDetails: P200225paymentDetails,
        invoice: P200225invoice,
        totalSettlement: '92.000,00 DKK',
        other: P200225other
    })

    await createContract()
    await createContract()
}

async function initUser() {
    const user = await controllerUser.create({ name: 'Anders', password: 'justinbieber' })
}

async function initVenues() {
    await controllerVenue.create({
        name: 'Hovedstedets Spiller',
        address: { streetAndNumber: 'Den Rigtige Vej 37', zipAndCity: '1000 Staden' }
    })
    await controllerVenue.create({
        name: 'Mang Yang',
        address: { streetAndNumber: 'Kineservej 66', zipAndCity: '9000 Asiantown' }
    })
    await controllerVenue.create({
        name: 'Marianas Diktatur',
        address: { streetAndNumber: 'Slavevej 17', zipAndCity: '9999 Paris' }
    })
}

async function initTour() {
    const venue2 = await controllerVenue.create({
        name: 'Spillerens ANDET Sted',
        address: { streetAndNumber: 'Hellebellevej 38', zipAndCity: '4040 Bullerby' }
    })

    const tourDay = { note: 'Under forhandling', date: 'Tirsdag, December 1, 2020' }
    tour = await controllerTour.create({
        name: 'PATINA – 2020',
        band: band._id,
        tourDays: [{ concert }, tourDay],
        bruttoList: [venue._id, venue2._id]
    })
}

async function initStandard() {
    standard = await controllerStandard.create({
        invoiceTitle: 'ACB Music',
        paymentDetails: {
            daysToPay: 60,
            bankDetails: {
                description: `Betaling foregår via bankoverførsel til reg.konto: `,
                regNo: 1234,
                accountNo: 1234567891234
            },
            paymentRequirement: {
                description: `Du bedes tilføje fakturanr til overførslen`
            }
        },
        agentInformation: {
            companyDetails: {
                name: 'ACB Music',
                address: {
                    streetAndNumber: 'Standardvej 10',
                    zipAndCity: '1000 Standardiar',
                    country: 'Standardis'
                },
                CVR: 10961211
            },
            contactInformation: {
                telephone: 10101010,
                email: 'standard@eksempel.sd',
                web: 'standard.dk'
            },
            bankInformation: {
                bank: 'Danske Bank',
                accountDetails: {
                    regNo: 1234,
                    accountNo: 1234567891234
                }
            }
        }
    })
}

async function initInvoice() {
    const products = [
        {
            productId: 1,
            productSpec: 'Provision',
            quantity: 1,
            price: 2000,
            priceWithTax: 2500
        },
        {
            productId: 2,
            productSpec: 'Ekstra Kage',
            quantity: 200,
            price: 10,
            priceWithTax: 2000
        }
    ]
    await controllerInvoice.create({
        invoiceTitle: standard.invoiceTitle,
        customerInfo: {
            name: 'Hele Bele 1959',
            address: {
                streetAndNumber: 'Bootcamp 2931 West Street',
                zipAndCity: '39490 New Ham'
            },
            attendant: 'Sir Pig'
        },
        extraDescription: 'Der var et par ekstra omkostninger, men de er momsfrie for eksemplets skyld',
        invoiceDetails: {
            invoiceDate: '04-12-2020',
            ref: 'Ordrenr.: 499'
        },
        productList: products,
        taxInfo: {
            taxFreeAmount: 2000,
            taxAmount: 2000
        },
        totalPriceWithTax: {
            subtotal: 4000,
            tax: 500,
            totalPrice: 4500
        },
        paymentDetails: {
            conditions: {
                daysToPay: standard.paymentDetails.daysToPay,
                inDueDate: '02-02-2020'
            },
            bankDetails: {
                description: standard.paymentDetails.bankDetails.description,
                regNo: standard.paymentDetails.bankDetails.regNo,
                accountNo: standard.paymentDetails.bankDetails.accountNo
            },
            paymentRequirement: {
                description: standard.paymentDetails.paymentRequirement.description
            }
        },
        agentInformation: {
            companyDetails: {
                name: standard.agentInformation.companyDetails.name,
                address: {
                    streetAndNumber: standard.agentInformation.companyDetails.address.streetAndNumber,
                    zipAndCity: standard.agentInformation.companyDetails.address.zipAndCity,
                    country: standard.agentInformation.companyDetails.address.country
                },
                CVR: standard.agentInformation.companyDetails.CVR
            },
            contactInformation: {
                telephone: standard.agentInformation.contactInformation.telephone,
                email: standard.agentInformation.contactInformation.email,
                web: standard.agentInformation.contactInformation.web
            },
            bankInformation: {
                bank: standard.agentInformation.bankInformation.bank,
                accountDetails: {
                    regNo: standard.agentInformation.bankInformation.accountDetails.regNo,
                    accountNo: standard.agentInformation.bankInformation.accountDetails.accountNo
                }
            }
        }
    })
}

async function initDb() {
    await emptyDb()
    await initBand()
    await initPromoters()
    await initConcert()
    await initVenue()
    await initContract() // requires: band, promoter, concert
    await initUser()
    await initStandard()
    await initInvoice() // requires: standard-invoice
    await initVenues()
    await initTour() // requires: band, venue
    process.exit()
}

initDb()
