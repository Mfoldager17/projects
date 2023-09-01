const User = require('../models/user-model')

// Endpoints functions

/**
 * Correct Login
 *
 * @param {} data containing username, and password
 * @returns {Boolean} true if username and password match
 */
exports.correctLogin = async function (data) {
    let isMatch = false
    const dbUser = await User.findOne({ name: data.name }).exec()
    if (dbUser) {
        dbUser.comparePassword(data.password, (error, match) => {
            if (match) {
                isMatch = true
            }
        })
    }
    return isMatch
}

/**
 * Create a user in the system where
 * username = name
 * and password
 *
 * @param {} data, containing at least name, password
 */
exports.create = async function (data) {
    return await User.create(data)
}
