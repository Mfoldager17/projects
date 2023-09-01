const mongoose = require('mongoose')

const contractSchema = new mongoose.Schema({
    contractNumber: { type: String, required: true, unique: true },
    contractDate: String,
    concert: {
        type: mongoose.ObjectId,
        ref: 'Concert',
        required: true
    },
    ticketPrice: String,
    paymentDetails: String,
    invoice: {
        economy: {
            netFees: String,
            productionCosts: String,
            commision: String,
            negotiatedPrice: String
        },
        settlementArtist: {
            netFees: String,
            productionCosts: String,
            plusVat: String,
            totalSettlement: String
        },
        settlementAgency: {
            commision: String,
            plusVat: String,
            totalSettlement: String
        }
    },
    totalSettlement: String,
    other: String
})

module.exports = mongoose.model('Contract', contractSchema)
