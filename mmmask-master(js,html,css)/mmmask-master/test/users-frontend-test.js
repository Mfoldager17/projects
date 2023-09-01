require('should')
const request = require('supertest')
const session = require('supertest-session')
const app = require('../app')
const controller = require('../controllers/users-controller')

async function createUserAndAuthenticate() {
    const userData = { name: 'Anders', password: 'sa20SA' }
    await controller.create(userData)
    const authSession = session(app)
    await authSession.post('/login').send(userData)
    return authSession
}

describe('users-frontend-test', function () {
    before(function () {
        app.enable('testEnableAuthentication')
    })

    after(function () {
        app.disable('testEnableAuthentication')
    })

    describe('visiting /login', function () {
        it('to see login fields', async function () {
            const response = (await request(app).get('/login').expect(200).expect('Content-Type', /html/u)).text

            response.search(/<input.*?id="name"/u).should.be.greaterThan(0)
            response.search(/<input.*?id="password"/u).should.be.greaterThan(0)
            response.search(/<button.*?id="login"/u).should.be.greaterThan(0)
        })
    })

    describe('visiting /contracts', function () {
        it('when not logged in expecting to be prompted', async function () {
            const response = (await request(app).get('/contracts').expect('Content-Type', /html/u)).text

            response.search(/<input.*?id="name"/u).should.be.greaterThan(0)
            response.search(/<input.*?id="password"/u).should.be.greaterThan(0)
            response.search(/<button.*?id="login"/u).should.be.greaterThan(0)
        })

        it('after logged in expecting to not see login fields', async function () {
            const authSession = await createUserAndAuthenticate()
            const response = (await authSession.get('/contracts').expect(200).expect('Content-Type', /html/u)).text

            response.search(/<input.*?id="name"/u).should.be.equal(-1)
            response.search(/<input.*?id="password"/u).should.be.equal(-1)
            response.search(/<button.*?id="login"/u).should.be.equal(-1)
        })
    })
})
