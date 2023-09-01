const mongoose = require('mongoose')

const promoterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        streetAndNumber: String,
        zipCodeAndCity: String
    },
    contactPerson: {
        name: String,
        phoneNr: String,
        mail: String
    }
})

module.exports = mongoose.model('Promoter', promoterSchema)
