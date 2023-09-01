const Promoter = require('../models/promoter-model')

exports.getAll = async function () {
    return await Promoter.find().populate('artist').exec()
}

exports.getById = async function (id) {
    return await Promoter.findById(id).exec()
}

exports.create = async function (data) {
    return await Promoter.create(data)
}

exports.update = async function (id, data) {
    return await Promoter.findByIdAndUpdate(id, data, { new: true }).exec()
}

exports.delete = async function (id) {
    return await Promoter.findByIdAndDelete(id).exec()
}
