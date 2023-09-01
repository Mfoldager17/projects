const mongoose = require('mongoose')
const Invoice = require('../models/invoice-model')
const config = require('../config')

mongoose.connect(config.databaseURI, { useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex: true})

exports.getAll = async function () {
    return await Invoice.find().exec()
}

exports.getInvoiceById = async function (id) {
    return await Invoice.findById(id).exec()
}

exports.create = async function (data) {
    return await Invoice.create(data)
}

exports.delete = async function (id){
    return await Invoice.findByIdAndDelete(id)
}