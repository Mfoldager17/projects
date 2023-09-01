const jwt = require('jsonwebtoken')
const config = require('../config')

exports.generateToken = function (urlpath, expirationInDays) {
    if (!urlpath || !expirationInDays) throw new Error('Insufficient data')
    return jwt.sign({ urlpath }, config.ACCESS_TOKEN_SECRET, { expiresIn: expirationInDays + 'd' })
}

exports.verifyTokenUrl = function (urlpath, token) {
    const urlpathToken = jwt.verify(token, config.ACCESS_TOKEN_SECRET).urlpath
    return urlpath === urlpathToken
}

/**
 * authenticateToken.
 *
 * Looks for param token, if it does not exists return false
 * if the token is falsy return 401, else verify token.
 * If token does not grant access to page, return 403
 *
 * @returns {Boolean} true if token is verified
 */
exports.verifyTokenUrlWithErrorCode = function (urlpath, token) {
    if (!token) return 401
    else {
        const isTokenValid = this.verifyTokenUrl(urlpath, token)
        if (!isTokenValid) return 403
        else return true
    }
}
