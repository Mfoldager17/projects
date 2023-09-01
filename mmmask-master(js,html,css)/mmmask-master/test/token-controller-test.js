require('should')
const controller = require('../controllers/token-controller')

describe('token-controller-test', function () {
    let baseUrl
    let contractsUrl
    let expirationInDays

    before(function () {
        baseUrl = '/'
        contractsUrl = '/contracts'
        expirationInDays = 10
    })

    it('should give a token given a url', function () {
        const token = controller.generateToken(baseUrl, expirationInDays)
        token.should.be.a.String()
        token.length.should.be.above(50)
    })

    it('should give error if insufficient: missing argument', function () {
        try {
            controller.generateToken(baseUrl)
            throw new Error('Incorrect error, I want to reach catch')
        } catch (err) {
            err.message.should.equal('Insufficient data')
        }
    })

    it('should be true given same url as token', function () {
        const token = controller.generateToken(baseUrl, expirationInDays)
        controller.verifyTokenUrl(baseUrl, token).should.be.true()

        const token2 = controller.generateToken(contractsUrl, expirationInDays)
        controller.verifyTokenUrl(contractsUrl, token2).should.be.true()
    })

    it('should be false given different url as token', function () {
        const token = controller.generateToken(baseUrl, expirationInDays)
        controller.verifyTokenUrl(contractsUrl, token).should.be.false()
    })

    // TODO: test for expirationInDays
})
