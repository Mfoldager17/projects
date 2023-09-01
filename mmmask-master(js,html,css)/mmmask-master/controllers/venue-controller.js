const Venue = require('../models/venue-model')

exports.getAll = async function () {
    return await Venue.find().exec()
}

exports.getById = async function (id) {
    return await Venue.findById(id).exec()
}

exports.create = async function (data) {
    return await Venue.create(data)
}

exports.update = async function (id, data) {
    return await Venue.findByIdAndUpdate(id, data, { new: true }).exec()
}

exports.delete = async function (id) {
    return await Venue.findByIdAndDelete(id).exec()
}
