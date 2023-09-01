require('should')
const controller = require('../controllers/promoter-controller')
const config = require('../config')
const mongoose = require('mongoose')
mongoose.connect(config.databaseURI, { useNewUrlParser: true, useUnifiedTopology: true })

describe('promoter-controller-test:', function () {
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

    describe('create()', function () {
        it('should return created promoter', async () => {
            const promoter = await controller.create(basePromoter)
            promoter._doc.should.containEql(basePromoter)
        })
        describe('can provide with errors given', () => {
            it('a nameless promoter', async () => {
                const promoterWithoutName = Object.assign({}, basePromoter)
                delete promoterWithoutName.name
                try {
                    const promoter = await controller.create(promoterWithoutName)
                    throw 'Expecting NOT this error' // ensures catch is triggered
                } catch (err) {
                    err.name.should.be.equal('ValidationError') // Default error from mongo
                    err.message.should.be.match(/Promoter validation failed: name: Path `name` is required./)
                }
            })

            it('duplicate promoter names', async () => {
                try {
                    const promoter1 = await controller.create(basePromoter)
                    const promoter2 = await controller.create(basePromoter)
                    throw 'Expecting NOT this error' // ensures catch is triggered
                } catch (err) {
                    err.name.should.be.equal('MongoError') // Default error from mongo
                    err.message.should.be.match(/E11000 duplicate key error collection/)
                }
            })
        })
    })

    describe('getAll() gives', function () {
        it('0 count when no entries', async () => {
            const promoters = await controller.getAll()
            promoters.length.should.be.equal(0)
        })
        it('1 count when adding 1', async () => {
            await controller.create(basePromoter)
            const promoters = await controller.getAll()
            promoters.length.should.be.equal(1)
        })
        it('2 count when adding 2, and find both in list', async () => {
            // Test data
            const basePromoter2 = Object.assign({}, basePromoter)
            basePromoter2.name = 'Base 2'

            const promoter = await controller.create(basePromoter)
            const promoter2 = await controller.create(basePromoter2)

            const promoters = await controller.getAll()

            promoters.length.should.be.equal(2)
            promoters.should.containDeep([promoter._doc, promoter2._doc])
        })
    })

    describe('update() gives', function () {
        it('same promoter with updated values', async () => {
            const promoterOld = await controller.create(basePromoter)
            const promoterNewName = Object.assign({}, basePromoter)
            promoterNewName.name = promoterOld.name + ' NEW'

            const promoterUpdated = await controller.update(promoterOld._id, promoterNewName)

            // TODO: HERE
            // promoterUpdated.should.containEql(promoterNewName)
            promoterUpdated._id.toString().should.equal(promoterOld._doc._id.toString())
        })

        it('error when parsing bad id', async () => {
            try {
                const promoterUpdated = await controller.update('badId', basePromoter)
                throw 'Expecting NOT this error' // ensures catch is triggered
            } catch (err) {
                err.name.should.be.equal('CastError')
                err.message.should.be.match(/Cast to ObjectId failed for value/)
            }
        })
    })

    describe('delete() gives', function () {
        it('back the promoter on succesful delete', async () => {
            const promoterFirst = await controller.create(basePromoter)
            const promoterDeleted = await controller.delete(promoterFirst._id)

            promoterFirst._doc.should.containEql(promoterDeleted._doc)
        })
        it('error if invalid id', async () => {
            try {
                const promoter = await controller.delete('badId', basePromoter)
                throw 'Expecting NOT this error' // ensures catch is triggered
            } catch (err) {
                err.name.should.be.equal('CastError')
                err.message.should.be.equal(
                    'Cast to ObjectId failed for value "badId" at path "_id" for model "Promoter"'
                )
            }
        })
    })
})
