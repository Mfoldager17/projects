const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')
const config = require('../config')

const connection = mongoose.createConnection(config.databaseURI, { useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex: true})
autoIncrement.initialize(connection)

const invoiceSchema = new mongoose.Schema({
    invoiceTitle: String,
    customerInfo: {
        name: String,
        address: {
            streetAndNumber: String,
            zipAndCity: String
        },
        attendant: String,
    },
    extraDescription: String,
    invoiceDetails: {
        invoiceDate: String,
        ref: String
    },
    productList: [
        {
            productId: Number,
            productSpec: String,
            quantity: Number,
            price: Number,
            priceWithTax: Number
        }
    ],
    taxInfo: {
        taxFreeAmount: Number,
        taxAmount: Number
    },
    totalPriceWithTax: {
        subtotal: Number,
        tax: Number,
        totalPrice: Number
    },
    paymentDetails: {
        conditions: {
            daysToPay: Number,
            inDueDate: String
        },
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

invoiceSchema.plugin(autoIncrement.plugin, {
    model: 'Invoice',
    field: 'invoiceNumber',
    startAt: 10000,
    incrementBy: 1
})

module.exports = mongoose.model('Invoice', invoiceSchema)
