const Contract = require('../models/contract-model')

exports.getAll = async function () {
    return await Contract.find()
        .populate({
            path: 'concert',
            populate: { path: 'promoter' }
        })
        .populate({
            path: 'concert',
            populate: { path: 'band' }
        })
        .exec()
}

exports.getById = async function (id) {
    return await Contract.findById(id)
        .populate({
            path: 'concert',
            populate: { path: 'promoter' }
        })
        .populate({
            path: 'concert',
            populate: { path: 'band' }
        })
        .exec()
}

exports.create = async function (data) {
    return await Contract.create(data)
}

exports.update = async function (id, data) {
    return await Contract.findByIdAndUpdate(id, data, { new: true })
        .populate({
            path: 'concert',
            populate: { path: 'promoter' }
        })
        .populate({
            path: 'concert',
            populate: { path: 'band' }
        })
        .exec()
}

exports.delete = async function (id) {
    return await Contract.findByIdAndDelete(id).exec()
}
