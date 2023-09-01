const mongoose = require('mongoose')

const invoiceStandardSchema = new mongoose.Schema({
    invoiceTitle: String,
    paymentDetails: {
        daysToPay: Number,
        bankDetails: {
            description: String,
            regNo: Number,
            accountNo: Number
        },
        paymentRequirement: {
            description: String
        }
    },
    agentInformation: {
        companyDetails: {
            name: String,
            address: {
                streetAndNumber: String,
                zipAndCity: String,
                country: String
            },
            CVR: Number
        },
        contactInformation: {
            telephone: Number,
            email: String,
            web: String
        },
        bankInformation: {
            bank: String,
            accountDetails: {
                regNo: Number,
                accountNo: Number
            }
        }
    }
})

module.exports = mongoose.model('InvoiceStandard', invoiceStandardSchema)