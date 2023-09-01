require('should')
const request = require('supertest')
const app = require('../app')
const Promoter = require('../models/promoter-model')
const controller = require('../controllers/promoter-controller')

describe('with promoter api i can:', function () {
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

    // post endpoint
    describe('try to POST promoters', function () {
        after(async () => {
            await Promoter.deleteMany()
        })

        it('and post correct should work', async () => {
            const response = await request(app)
                .post('/api/promoters')
                .send(JSON.stringify(basePromoter))
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .expect(201)
            response.body.name.should.equal(basePromoter.name)
            response.body.address.should.containEql(basePromoter.address)
            response.body.contactPerson.should.containEql(basePromoter.contactPerson)
            // response.body.postalcode.should.be.equal(basePromoter.postalcode)
            // response.body.city.should.be.equal(basePromoter.city)
            // response.body.attendant.should.be.equal(basePromoter.attendant)
            // response.body.telephone.should.be.equal(basePromoter.telephone)
            // response.body.mail.should.be.equal(basePromoter.mail)
        })

        it('and post incorrect (without name) should fail', async () => {
            let promoterNameless = Object.assign({}, basePromoter)
            promoterNameless.name = ''

            await request(app)
                .post('/api/promoters')
                .send({ promoterNameless })
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .expect(422)
        })

        it('and posting identical names should give error', async () => {
            controller.create(basePromoter)
            await request(app)
                .post('/api/promoters')
                .send(JSON.stringify(basePromoter))
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .expect(409)
        })
    })
    // put endpoint
    describe('try to update (PUT) new values', function () {
        it('and be able to update name', async () => {
            const promoter = await controller.create(basePromoter)
            const promoterNew = basePromoter
            promoterNew.name = promoterNew.name + ' TEST'

            const response = await request(app)
                .put('/api/promoters/' + promoter._id)
                .send(JSON.stringify(promoterNew))
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .expect(200)

            response.body.should.containEql(promoterNew)

            // response.body.name.should.be.equal(promoterNewName._doc.name)
            // response.body.address.should.be.equal(promoterNewName._doc.address)
            // response.body.postalcode.should.be.equal(promoterNewName._doc.postalcode)
            // response.body.city.should.be.equal(promoterNewName._doc.city)
            // response.body.attendant.should.be.equal(promoterNewName._doc.attendant)
            // response.body.telephone.should.be.equal(promoterNewName._doc.telephone)
            // response.body.mail.should.be.equal(promoterNewName._doc.mail)
            // response.body._id.should.be.equal('' + basePromoterInDb._id) // ID should be same as original
        })

        it('and give error with illegal id', async () => {
            await request(app)
                .put('/api/promoters/' + 'bad-id')
                .send(
                    JSON.stringify({
                        _id: 'bad-id',
                        name: 'Poptester City Downtown Lolol',
                        address: 'Haramsensvej 28',
                        postalcode: 8030,
                        city: 'Baggish',
                        attendant: 'Lemming Dragøgersen',
                        telephone: '+45 70 70 70 70',
                        mail: 'ld_7070@Poptester.com'
                    })
                )
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .expect(422)
        })
    })
    // delete endpoint
    describe('DELETE tests', function () {
        let basePromoterInDb

        before(async () => {
            basePromoterInDb = await controller.create(basePromoter)
        })

        it("delete('/api/promoters/:id')", async () => {
            const response = await request(app)
                .delete('/api/promoters/' + basePromoterInDb._id)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .expect(200)
        })
        it("delete('/api/promoters/:id') bad id", async () => {
            const response = await request(app)
                .delete('/api/promoters/' + 'bad-id')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .expect(422)
        })
    })
})
