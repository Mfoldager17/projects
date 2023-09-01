const mongoose = require('mongoose')

const concertSchema = new mongoose.Schema({
    promoter: {
        type: mongoose.ObjectId,
        ref: 'Promoter',
        required: true
    },
    band: {
        type: mongoose.ObjectId,
        ref: 'Band',
        required: true
    },
    venue: {
        name: String,
        address: {
            streetAndNumber: String,
            zipCodeAndCity: String
        }
    },
    time: {
        date: String,
        start: String,
        duration: String
    },
    capacity: String,
    memo: String,
    state: String // Skal kun have mulighed for 3? forskellige i frontend
})

module.exports = mongoose.model('Concert', concertSchema)
