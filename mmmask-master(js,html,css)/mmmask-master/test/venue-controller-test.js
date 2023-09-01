require('should')
const controller = require('../controllers/venue-controller')
const config = require('../config')
const mongoose = require('mongoose')
mongoose.connect(config.databaseURI, { useNewUrlParser: true, useUnifiedTopology: true })

describe('venue-controller test', function () {
    let testVenue
    before(() => {
        testVenue = {
            name: 'Test Venue',
            address: {
                streetAndNumber: 'Test Address',
                zipAndCity: '1324 Test City'
            }
        }
    })

    describe('create()', () => {
        it('should return created venue', async () => {
            const venue = await controller.create(testVenue)
            venue._doc.should.containEql(testVenue)
        })
        describe('provide the given error', () => {
            it('a nameless venue', async () => {
                const venueWithoutName = Object.assign({}, testVenue)
                delete venueWithoutName.name
                try {
                    const venue = await controller.create(venueWithoutName)
                    throw 'Expecting NOT this error'
                } catch (err) {
                    err.name.should.be.equal('ValidationError')
                    err.message.should.be.match('Venue validation failed: name: Path `name` is required.')
                }
            })
            it('duplicate venue names', async () => {
                try {
                    const venue1 = await controller.create(testVenue)
                    const venue2 = await controller.create(testVenue)
                    throw 'Expecting NOT this error'
                } catch (err) {
                    err.name.should.be.equal('MongoError')
                    err.message.should.be.match(/E11000 duplicate key error collection/)
                }
            })
        })
    })

    describe('getAll()', function () {
        it('0 count when no entiries', async () => {
            const venues = await controller.getAll()
            venues.length.should.be.equal(0)
        })
        it('1 count when adding 1', async () => {
            await controller.create(testVenue)
            const venues = await controller.getAll()
            venues.length.should.be.equal(1)
        })
        it('2 count when adding 2, and find both in list', async () => {
            const testVenue2 = Object.assign({}, testVenue)
            testVenue2.name = 'Test Venue 2'

            const venue = await controller.create(testVenue)
            const venue2 = await controller.create(testVenue2)

            const venues = await controller.getAll()
            venues.length.should.be.equal(2)
            venues.should.containDeep([venue._doc, venue2._doc])
        })
    })

    describe('update()', () => {
        it('same venue with updated values', async () => {
            const venueOld = await controller.create(testVenue)
            const venueNew = Object.assign({}, testVenue)
            venueNew.name = venueOld.name + ' NEW'

            const venueUpdated = await controller.update(venueOld._id, venueNew)

            venueUpdated._id.toString().should.be.equal(venueOld._doc._id.toString())
        })
        it('error when parsing bad id', async () => {
            try {
                const venueUpdated = await controller.update('badId', testVenue)
                throw 'Expecting NOT this error'
            } catch (err) {
                err.name.should.be.equal('CastError')
                err.message.should.be.match('Cast to ObjectId failed for value "badId" at path "_id" for model "Venue"')
            }
        })
    })

    describe('delete()', () => {
        it('returns the venue on succesful delete', async () => {
            const venueFirst = await controller.create(testVenue)
            const venueDeleted = await controller.delete(venueFirst)

            venueFirst._doc.should.containEql(venueDeleted._doc)
        })
        it('error if invalid id', async () => {
            try {
                const venue = await controller.delete('badId', testVenue)
                throw 'Expecting NOT this error'
            } catch (err) {
                err.name.should.be.equal('CastError')
                err.message.should.be.equal('Cast to ObjectId failed for value "badId" at path "_id" for model "Venue"')
            }
        })
    })
})
