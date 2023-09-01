require('should')
const controller = require('../controllers/bands-controller')

const bandData = {
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
}

async function createBand() {
    return await controller.create(bandData)
}

describe('bands-controller-test:', function () {
    let id
    describe('createBand()', function () {
        it('should return created band', async () => {
            const band = await createBand()
            id = band._id
            band.name.should.be.equal('PostTester')
            band.members.should.be.equal('MedlemmerTest')
            band.companyName.should.be.equal('companyNameTest')
            band.address.streetAndNumber.should.be.equal('streetAndNumberTest')
            band.address.zipCodeAndCity.should.be.equal('zipCodeAndCityTest')
            band.cvrNr.should.be.equal('cvrNrTest')
            band.accNr.should.be.equal('accNrTest')
            band.regNr.should.be.equal('regNrTest')
            band.contactPerson.name.should.be.equal('contactPersonNameTest')
            band.contactPerson.phoneNr.should.be.equal('contactPersonPhoneNrTest')
            band.contactPerson.mail.should.be.equal('contactPersonMailTest')
        })
        it('should return error', async () => {
            try {
                await controller.create({
                    members: 'MedlemmerTest',
                    cvrNr: 'cvrTest',
                    accNr: 'kontoTest',
                    regNr: 'regTest'
                })
                throw new Error('Skulle aldrig ske')
            } catch (error) {
                error.name.should.be.equal('ValidationError')
                error.message.should.be.equal('Band validation failed: name: Path `name` is required.')
            }
        })
    })
    describe('getAll()', function () {
        it('should be greater than 0', async () => {
            await createBand()
            const bands = await controller.getAll()
            bands.length.should.be.greaterThan(0)
        })
        it('last band should be equal to newly created', async () => {
            await createBand()
            const bands = await controller.getAll()
            bands.length.should.be.greaterThan(0)
            const lastBand = bands[bands.length - 1]
            lastBand._doc.should.containEql(bandData)
            // lastBand.name.should.be.equal('PostTester')
            // lastBand.members.should.be.equal('MedlemmerTest')
            // lastBand.companyName.should.be.equal('companyNameTest')
            // lastBand.address.streetAndNumber.should.be.equal('streetAndNumberTest')
            // lastBand.address.zipCodeAndCity.should.be.equal('zipCodeAndCityTest')
            // lastBand.cvrNr.should.be.equal('cvrNrTest')
            // lastBand.accNr.should.be.equal('accNrTest')
            // lastBand.regNr.should.be.equal('regNrTest')
            // lastBand.contactPerson.name.should.be.equal('contactPersonNameTest')
            // lastBand.contactPerson.phoneNr.should.be.equal('contactPersonPhoneNrTest')
            // lastBand.contactPerson.mail.should.be.equal('contactPersonMailTest')
        })
    })
    describe('update()', function () {
        it('should return updated band', async () => {
            const band = await createBand()

            const bandNew = await controller.update(band._id, {
                name: band.name + ' UPDATED',
                members: band.members + ' UPDATED'
            })

            bandNew.name.should.be.equal(band.name + ' UPDATED')
            bandNew.members.should.be.equal(band.members + ' UPDATED')
            // bandNew.companyName.should.be.equal('companyNameTest-updated')
            // bandNew.address.streetAndNumber.should.be.equal('streetAndNumberTest-updated')
            // bandNew.address.zipCodeAndCity.should.be.equal('zipCodeAndCityTest-updated')
            // bandNew.cvrNr.should.be.equal('cvrNrTest-updated')
            // bandNew.accNr.should.be.equal('accNrTest-updated')
            // bandNew.regNr.should.be.equal('regNrTest-updated')
            // bandNew.contactPerson.name.should.be.equal('contactPersonNameTest-updated')
            // bandNew.contactPerson.phoneNr.should.be.equal('contactPersonPhoneNrTest-updated')
            // bandNew.contactPerson.mail.should.be.equal('contactPersonMailTest-updated')
        })
        it('should give error for bad id', async () => {
            try {
                const badId = 'badId'
                await controller.update(badId, {
                    name: 'PostTester-updated',
                    members: 'MedlemmerTest-updated',
                    cvrNr: 'cvrTest-updated',
                    accNr: 'kontoTest-updated',
                    regNr: 'regTest-updated'
                })
                throw new Error('Skulle aldrig ske')
            } catch (error) {
                error.name.should.be.equal('CastError')
                error.message.should.be.equal(
                    'Cast to ObjectId failed for value "badId" at path "_id" for model "Band"'
                )
            }
        })
    })
    describe('delete()', function () {
        it('should return removed band', async () => {
            const band = await createBand()
            const bandDeleted = await controller.delete(band._id)

            bandDeleted._doc.should.containEql(bandData)
            // bandDeleted.name.should.be.equal('PostTester-updated')
            // bandDeleted.members.should.be.equal('MedlemmerTest-updated')
            // bandDeleted.companyName.should.be.equal('companyNameTest-updated')
            // bandDeleted.address.streetAndNumber.should.be.equal('streetAndNumberTest-updated')
            // bandDeleted.address.zipCodeAndCity.should.be.equal('zipCodeAndCityTest-updated')
            // bandDeleted.cvrNr.should.be.equal('cvrNrTest-updated')
            // bandDeleted.accNr.should.be.equal('accNrTest-updated')
            // bandDeleted.regNr.should.be.equal('regNrTest-updated')
            // bandDeleted.contactPerson.name.should.be.equal('contactPersonNameTest-updated')
            // bandDeleted.contactPerson.phoneNr.should.be.equal('contactPersonPhoneNrTest-updated')
            // bandDeleted.contactPerson.mail.should.be.equal('contactPersonMailTest-updated')
        })
        it('should give error for bad id', async () => {
            try {
                const badId = 'badId'
                await controller.delete(badId)
                throw new Error('Skulle aldrig ske')
            } catch (error) {
                error.name.should.be.equal('CastError')
                error.message.should.be.equal(
                    'Cast to ObjectId failed for value "badId" at path "_id" for model "Band"'
                )
            }
        })
    })
})
