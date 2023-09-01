const mongoose = require('mongoose')

const bandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    companyName: String,
    members: String,
    address: {
        streetAndNumber: String,
        zipCodeAndCity: String
    },
    cvrNr: String,
    accNr: String,
    regNr: String,

    contactPerson: {
        name: String,
        phoneNr: String,
        mail: String
    }
})

module.exports = mongoose.model('Band', bandSchema)
