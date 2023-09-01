const mongoose = require('mongoose')
const config = require('../config')
mongoose.connect(config.databaseURI, { useNewUrlParser: true, useUnifiedTopology: true })

const Band = require('../models/band-model')
const Concert = require('../models/concert-model')
const Promoter = require('../models/promoter-model')
const Contract = require('../models/contract-model')
const User = require('../models/user-model')
const Tour = require('../models/tour-model')
const Venue = require('../models/venue-model')

async function emptyDb() {
    await Band.deleteMany()
    await Concert.deleteMany()
    await Promoter.deleteMany()
    await Contract.deleteMany()
    await User.deleteMany()
    await Tour.deleteMany()
    await Venue.deleteMany()
}

exports.mochaHooks = {
    async afterEach() {
        await emptyDb()
    }
}

exports.emptyDb = emptyDb()
