const Profile = require('../models/profile-model')

/**
 * @param {Object} data of the new profile
 * @returns {Object} new created Profile
 */
exports.create = async function (data) {
    return await Profile.create(data)
}

/**
 * @param {Integer} utNumber 
 * @returns {Object} if utNumber exsist in the Database
 */
exports.getByUTNumber = async function (utNumber) {
    return await Profile.findOne({ 'utNumber': utNumber })
}

/**
 * 
 * @param {Integer} utNumber to update 
 * @param {Object} data the updated data
 * @returns 
 */
exports.findOneAndUpdate = async function (utNumber, data) {
    return await Profile.findOneAndUpdate({ 'utNumber': utNumber }, data, { new: true })
}

exports.delete = async function (utNumber) {
    return await Profile.findOneAndDelete({ 'utNumber': utNumber })
}