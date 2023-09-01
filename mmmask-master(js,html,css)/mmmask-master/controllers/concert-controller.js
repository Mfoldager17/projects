const Concert = require('../models/concert-model')

exports.create = async function (data) {
    return await Concert.create(data)
}

exports.getAll = async function () {
    return await Concert.find().populate('band').populate('promoter').exec()
}

exports.getByName = async function (bandName) {
    return await Concert.find().where('name').equals(bandName).exec()
}

exports.getById = async function (id) {
    return await Concert.findById(id).populate('band').populate('promoter').exec()
}

exports.update = async function (id, data) {
    return await Concert.findByIdAndUpdate(id, data, { new: true }).exec()
}

exports.delete = async function (id) {
    return await Concert.findByIdAndDelete(id).exec()
}
