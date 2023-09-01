const mongoose = require('mongoose')

mongoose.set('useFindAndModify', false)

const venueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        streetAndNumber: String,
        zipAndCity: String
    }
})

module.exports = mongoose.model('Venue', venueSchema)
