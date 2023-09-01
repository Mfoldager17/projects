require('should')
const session = require('supertest-session')
const app = require('../app')
const controllerUsers = require('../controllers/users-controller')
const controllerToken = require('../controllers/token-controller')
const mongoose = require('mongoose')
const config = require('../config')
mongoose.connect(config.databaseURI, { useNewUrlParser: true, useUnifiedTopology: true })

async function createUserAndAuthenticate() {
    const userData = { name: 'Anders', password: 'sa20SA' }
    await controllerUsers.create(userData)
    const authSession = session(app)
    await authSession.post('/login').send(userData)
    return authSession
}

describe('token api test ', function () {
    let tokenBase

    before(function () {
        app.enable('testEnableAuthentication')
        tokenBase = { urlpath: '/contracts', expirationInDays: '10' }
    })

    after(function () {
        app.disable('testEnableAuthentication')
    })

    it('can generate token when authenticated', async function () {
        const authSession = await createUserAndAuthenticate()
        const response = await authSession.post('/api/token').send(tokenBase).expect(201)
        const token = response.body

        controllerToken.verifyTokenUrl(tokenBase.urlpath, token).should.be.true()
    })

    it('can NOT generate token when UNauthenticated', async function () {
        const unauthSession = session(app)
        await unauthSession.post('/api/token').send(tokenBase).expect(401)
    })
})
