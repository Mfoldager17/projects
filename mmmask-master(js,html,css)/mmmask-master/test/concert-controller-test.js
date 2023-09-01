require('should')
const promoterController = require('../controllers/promoter-controller')
const bandController = require('../controllers/bands-controller')
const concertController = require('../controllers/concert-controller')
const { throws } = require('should')

async function createBand() {
    return await bandController.create({
        name: 'Test Band'
    })
}

async function createPromoter() {
    return await promoterController.create({
        name: 'Test Promoter'
    })
}

async function createConcert() {
    const band = await createBand()
    const promoter = await createPromoter()
    return await concertController.create({
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
            date: '2021-01-01',
            start: '20:00',
            duration: '60 min.'
        },
        capacity: '500',
        memo: '7 tariffer + provision',
        state: 'TODO'
    })
}

describe('concert-controller-test', function () {
    describe('createConcert()', function () {
        it('should return created concert', async function () {
            const band = await createBand()
            const promoter = await createPromoter()

            const concert = await concertController.create({
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
                    date: '2021-01-01',
                    start: '20:00',
                    duration: '60 min.'
                },
                capacity: '500',
                memo: '7 tariffer + provision',
                state: 'TODO'
            })
            concert.promoter._id.should.be.equal(promoter._id)
            concert.band._id.should.be.equal(band._id)
            concert.venue.name.should.be.equal('venueNavn')
            concert.venue.address.streetAndNumber.should.be.equal('Vej 1')
            concert.venue.address.zipCodeAndCity.should.be.equal('8000 Aarhus')
            concert.time.date.should.be.equal('2021-01-01')
            concert.time.start.should.be.equal('20:00')
            concert.time.duration.should.be.equal('60 min.')
            concert.capacity.should.be.equal('500')
            concert.memo.should.be.equal('7 tariffer + provision')
            concert.state.should.be.equal('TODO')
        })
        it('should return error because band is missing', async function () {
            const band = await createBand()
            const promoter = await createPromoter()
            try {
                await concertController.create({
                    promoter: promoter._id,
                    band: band._id,
                    date: '2021-01-01',
                    time: '20:00',
                    memo: '7 tariffer + provision',
                    price: '',
                    concertLength: '60 min.'
                })
                throws('Test error, expecting validation error, NOT this')
            } catch (error) {
                error.name.should.be.equal('ValidationError')
                error.message.should.be.equal('Concert validation failed: band: Path `band` is required.')
            }
        })
    })
    describe('getAll()', function () {
        it('1 or more concerts already exist', async function () {
            await createConcert()
            const concerts = await concertController.getAll()
            concerts.length.should.be.greaterThan(0)
        })
        it('getById equal to newly created', async function () {
            const concert = await createConcert()
            concert.venue.name.should.be.equal('venueNavn')
            concert.venue.address.streetAndNumber.should.be.equal('Vej 1')
            concert.venue.address.zipCodeAndCity.should.be.equal('8000 Aarhus')
            concert.time.date.should.be.equal('2021-01-01')
            concert.time.start.should.be.equal('20:00')
            concert.time.duration.should.be.equal('60 min.')
            concert.capacity.should.be.equal('500')
            concert.memo.should.be.equal('7 tariffer + provision')
            concert.state.should.be.equal('TODO')
        })
    })
    describe('getConcert()', function () {
        it('should return error - bad id', async function () {
            try {
                const badId = 'badID'
                await concertController.getById(badId)
                throw new Error()
            } catch (error) {
                error.name.should.be.equal('CastError')
                error.message.should.be.equal(
                    'Cast to ObjectId failed for value "badID" at path "_id" for model "Concert"'
                )
            }
        })
    })
    describe('update()', function () {
        it('should return updated concert', async function () {
            const concert = await createConcert()
            const updatedConcert = await concertController.update(concert._id, {
                time: {
                    date: '2021-01-02',
                    start: '21:00',
                    duration: '61 min.'
                },
                memo: '8 tariffer + provision',
                state: 'TODO+1'
            })
            updatedConcert.time.date.should.be.equal('2021-01-02')
            updatedConcert.time.start.should.be.equal('21:00')
            updatedConcert.time.duration.should.be.equal('61 min.')
            updatedConcert.memo.should.be.equal('8 tariffer + provision')
            updatedConcert.state.should.be.equal('TODO+1')
        })
        it('should return error - bad id', async function () {
            try {
                const badId = 'badID'
                await concertController.update(badId, {
                    time: {
                        date: '2021-01-02',
                        start: '21:00',
                        duration: '61 min.'
                    },
                    memo: '8 tariffer + provision',
                    state: 'TODO+1'
                })
                throw new Error()
            } catch (error) {
                error.name.should.be.equal('CastError')
                error.message.should.be.equal(
                    'Cast to ObjectId failed for value "badID" at path "_id" for model "Concert"'
                )
            }
        })
    })
    describe('delete()', function () {
        it('should return removed concert', async function () {
            const concert = await createConcert()
            const concertDeleted = await concertController.delete(concert._id)

            concertDeleted._doc.should.containEql(concert._doc)
        })
        it('should give error for bad id', async function () {
            try {
                const badId = 'badId'
                await concertController.delete(badId)
            } catch (error) {
                error.name.should.be.equal('CastError')
                error.message.should.be.equal(
                    'Cast to ObjectId failed for value "badId" at path "_id" for model "Concert"'
                )
            }
        })
    })
})
