const Band = require('../models/band-model')

exports.getAll = async function () {
    return await Band.find().exec()
}

exports.get = async function (id) {
    return await Band.findById(id)
}

exports.create = async function (data) {
    return await Band.create(data)
}

/**
 *
 * @param {String} id for band to update
 * @param {Object} data properties to change
 * @returns {Object Band} with changes
 */
exports.update = async function (id, data) {
    return await Band.findByIdAndUpdate(id, data, { new: true }).exec()
}

exports.delete = async function (id) {
    return await Band.findByIdAndDelete(id).exec()
}
