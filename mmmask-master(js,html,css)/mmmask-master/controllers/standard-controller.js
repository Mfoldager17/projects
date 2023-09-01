const mongoose = require('mongoose')
const Standard = require('../models/invoice-standard-model')
const config = require('../config')

mongoose.connect(config.databaseURI, { useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex: true})

exports.get = async function () {
    return await Standard.find().exec()
}

exports.create = async function (data) {
    return await Standard.create(data)
}

exports.update = async function (id, data) {
    return await Standard.findByIdAndUpdate(id, data, { new: true }).exec()
}