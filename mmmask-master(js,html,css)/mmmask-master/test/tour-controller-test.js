require('should')
const bandsController = require('../controllers/bands-controller')
const controllerTour = require('../controllers/tour-controller')
const controllerVenue = require('../controllers/venue-controller')
const controllerConcert = require('../controllers/concert-controller')
const controllerPromoter = require('../controllers/promoter-controller')

async function createBand() {
    const band = await bandsController.create({
        name: 'PostTester',
        members: 'MedlemmerTest',
        companyName: 'companyNameTest',
        address: {
            streetAndNumber: 'streetAndNumberTest',
            zipCodeAndCity: 'zipCodeAndCityTest'
        },
        cvrNr: 'cvrNrTest',
        accNr: 'accNrTest',
        regNr: 'regNrTest',
        contactPerson: {
            name: 'contactPersonNameTest',
            phoneNr: 'contactPersonPhoneNrTest',
            mail: 'contactPersonMailTest'
        }
    })
    return band
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
            date: '2021-01-01',
            start: '20:00',
            duration: '60 min.'
        },
        capacity: '500',
        memo: '7 tariffer + provision',
        state: 'TODO'
    })
}

async function createVenue() {
    const venue = await controllerVenue.create({
        name: 'Spillerens Sted',
        address: {
            streetAndNumber: 'Hellebellevej 28',
            zipAndCity: '3939 Bullerby'
        }
    })
    return venue
}

describe('tour-controller-test', function () {
    describe('create tour test', function () {
        it('should return created test', async function () {
            // Initializing test elements
            const band = await createBand()
            const bandId = band._id
            const venue = await createVenue()
            const venueId = venue._id
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
                band: bandId,
                tourDays: [tourDay1, tourDay2],
                bruttoList: [venueId]
            })

            // Test
            tour.name.should.be.equal('PATINA – 2020')
            tour.band.toString().should.be.equal(bandId.toString())
            tour.tourDays[0].date.should.equal(tourDay1.date)
            tour.tourDays[0].note.should.equal(tourDay1.note)
            tour.tourDays[1].concert.toString().should.equal(tourDay2.concert._id.toString())
            tour.tourDays[1].note.should.equal(tourDay2.note)
            tour.bruttoList.length.should.be.equal(1)
        })
        it('should return error', async function () {
            try {
                await controllerTour.create({ name: 'tourname' })
                throw new Error('Skulle aldrig ske')
            } catch (error) {
                error.name.should.be.equal('ValidationError')
                error.message.should.be.equal('Tour validation failed: band: Path `band` is required.')
            }
        })
    })
    describe('getTours() should return tours', function () {
        it('0 when no tours in system', async function () {
            const tours = await controllerTour.getTours()
            tours.length.should.be.equal(0)
        })

        it('should have one', async function () {
            const band = await createBand()
            const bandId = band._id

            const tour = await controllerTour.create({
                name: 'PATINA – 2020',
                band: bandId
            })

            const tours = await controllerTour.getTours()
            tours.length.should.be.equal(1)
        })
    })
    describe('update tour', function () {
        it('should return updated tour', async function () {
            const band = await createBand()
            const bandId = band._id

            const venue = await createVenue()
            const venueId = venue._id

            const tour = await controllerTour.create({
                name: 'PATINA – 2020',
                band: bandId,
                bruttoList: [venueId]
            })

            const tourOYoy = await controllerTour.getById(tour._id)

            const updatedTour = await controllerTour.update(tour._id, {
                name: 'PATINA – 2021'
            })

            updatedTour.name.should.be.equal('PATINA – 2021')
        })
        it('should give error for bad id', async function () {
            try {
                const badId = 'badId'
                await controllerTour.update(badId, {})
                throw new Error('Skulle aldrig ske')
            } catch (error) {
                error.name.should.be.equal('CastError')
                error.message.should.be.equal(
                    'Cast to ObjectId failed for value "badId" at path "_id" for model "Tour"'
                )
            }
        })
    })
    describe('delete()', function () {
        it('should return deleted tour', async function () {
            const band = await createBand()
            const bandId = band._id

            const tour = await controllerTour.create({
                name: 'PATINA – 2020',
                band: bandId
            })

            const deletedTour = await controllerTour.delete(tour._id)

            deletedTour.name.should.be.equal('PATINA – 2020')
            deletedTour.band.toString().should.be.equal(bandId.toString())
        })
        it('should give error for bad id', async function () {
            try {
                const badId = 'badId'
                await controllerTour.delete(badId)
                throw new Error('Skulle aldrig ske')
            } catch (error) {
                error.name.should.be.equal('CastError')
                error.message.should.be.equal(
                    'Cast to ObjectId failed for value "badId" at path "_id" for model "Tour"'
                )
            }
        })
    })
})
