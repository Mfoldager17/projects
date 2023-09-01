require('should')
const app = require('../app')
const controller = require('../controllers/promoter-controller')
const request = require('supertest')
const config = require('../config')
const mongoose = require('mongoose')
mongoose.connect(config.databaseURI, { useNewUrlParser: true, useUnifiedTopology: true })

/**
 * hasValue.
 * Returns a RegExp which escapes the value, so characters does not count as regex
 * @param {} value
 */
function hasValue(value) {
    const escapedValue = value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
    return new RegExp(escapedValue)
}

describe('working with frontend promoters i should', function () {
    let basePromoter

    before(() => {
        basePromoter = {
            name: 'Poptester City Downtown',
            address: {
                streetAndNumber: 'Haramsensvej 28',
                zipCodeAndCity: '8030 Baggish'
            },
            contactPerson: {
                name: 'Lemming Dragøgersen',
                phoneNr: '+45 70 70 70 70',
                mail: 'ld_7070@Poptester.com'
            }
        }
    })

    it('see input in CREATING promoter page', async () => {
        const res = await request(app)
            .get('/promoters/create')
            .accept('Accept', 'application/html') // hmm
            .expect('Content-Type', /html/)
            .expect(200)

        res.text.search(/<input.*?id="name"/).should.be.greaterThan(0)
        res.text.search(/<input.*?id="streetAndNumber"/).should.be.greaterThan(0)
        res.text.search(/<input.*?id="zipCodeAndCity"/).should.be.greaterThan(0)
        res.text.search(/<input.*?id="attendant"/).should.be.greaterThan(0)
        res.text.search(/<input.*?id="phoneNr"/).should.be.greaterThan(0)
        res.text.search(/<input.*?id="mail"/).should.be.greaterThan(0)
        res.text.search(/<button.*?id="submit-or-edit">/).should.be.greaterThan(0)
    })
    it('see input and values when UPDATING promoter', async () => {
        const promoter = await controller.create(basePromoter)
        const res = (
            await request(app)
                .get('/promoters/edit?id=' + promoter._id)
                .accept('Accept', 'application/html') // hmm
                .expect('Content-Type', /html/)
                .expect(200)
        ).text

        // Has Input Fields
        res.search(/input.+id="name"/).should.be.greaterThan(0)
        res.search(/input.+id="streetAndNumber"/).should.be.greaterThan(0)
        res.search(/input.+id="zipCodeAndCity"/).should.be.greaterThan(0)
        res.search(/input.+id="attendant"/).should.be.greaterThan(0)
        res.search(/input.+id="phoneNr"/).should.be.greaterThan(0)
        res.search(/input.+id="mail"/).should.be.greaterThan(0)
        res.search(/<button id="submit-or-edit">/).should.be.greaterThan(0)

        // Has values
        res.search(hasValue(promoter.name)).should.be.greaterThan(0)
        res.search(hasValue(promoter.address.streetAndNumber)).should.be.greaterThan(0)
        res.search(hasValue(promoter.address.zipCodeAndCity)).should.be.greaterThan(0)
        res.search(hasValue(promoter.contactPerson.name)).should.be.greaterThan(0)
        res.search(hasValue(promoter.contactPerson.phoneNr)).should.be.greaterThan(0)
        res.search(hasValue(promoter.contactPerson.mail)).should.be.greaterThan(0)
    })

    it('see values for promoter when READING', async () => {
        const promoter = await controller.create(basePromoter)

        const res = (
            await request(app)
                .get('/promoters/edit?id=' + promoter._id)
                .accept('Accept', 'application/html') // hmm
                .expect('Content-Type', /html/)
                .expect(200)
        ).text

        // Has values
        res.search(hasValue(promoter.name)).should.be.greaterThan(0)
        res.search(hasValue(promoter.address.streetAndNumber)).should.be.greaterThan(0)
        res.search(hasValue(promoter.address.zipCodeAndCity)).should.be.greaterThan(0)
        res.search(hasValue(promoter.contactPerson.name)).should.be.greaterThan(0)
        res.search(hasValue(promoter.contactPerson.phoneNr)).should.be.greaterThan(0)
        res.search(hasValue(promoter.contactPerson.mail)).should.be.greaterThan(0)
    })

    it('see word slet when viewing (DELETE)', async () => {
        const promoter = await controller.create(basePromoter)
        const res = await request(app)
            .get('/promoters/edit?id=' + promoter._id)
            .accept('Accept', 'application/html') // hmm
            .expect('Content-Type', /html/)
            .expect(200)

        // Has values
        res.text.search(/<button.+Slet<\/button>/).should.be.greaterThan(0)
    })

    it('see more than one promoter', async () => {
        const promoter = await controller.create(basePromoter)
        const promoter2Name = 'Mathias Baghave'
        await controller.create({
            name: promoter2Name,
            address: {
                streetAndNumber: 'Et andet sted i Aarhus',
                zipCodeAndCity: '8200 Et andet sted i Jylland'
            },
            contactPerson: {
                name: 'Mathias',
                phoneNr: '87654321',
                mail: 'mathias2@zoomer.dk'
            }
        })

        const res = await request(app)
            .get('/promoters')
            .accept('Accept', 'application/html') // hmm
            .expect('Content-Type', /html/)
            .expect(200)

        // Has values
        res.text.search(hasValue(promoter.name)).should.be.greaterThan(0)
        res.text.search(hasValue(promoter2Name)).should.be.greaterThan(0)
    })
})
