require('should')
const controller = require('../controllers/users-controller')

const userData = {
    name: 'Anders',
    password: 'sa20SA'
}

async function createUser() {
    return await controller.create(userData)
}

describe('login-controller-test:', function () {
    describe('create()', function () {
        it('should return created user', async () => {
            const user = await createUser()
            user.name.should.be.equal('Anders')
        })
        it('should return error on name', async () => {
            try {
                await controller.create({
                    password: 'sa20SA'
                })
                throw new Error('Skulle aldrig ske')
            } catch (error) {
                error.name.should.be.equal('ValidationError')
                error.message.should.be.equal('User validation failed: name: Path `name` is required.')
            }
        })
        it('should return error on password', async () => {
            try {
                await controller.create({
                    name: 'Anders'
                })
                throw new Error('Skulle aldrig ske')
            } catch (error) {
                error.name.should.be.equal('ValidationError')
                error.message.should.be.equal('User validation failed: password: Path `password` is required.')
            }
        })
    })
    describe('correctLogin()', function () {
        it('should be true', async () => {
            const correctUser = await createUser()
            res = await controller.correctLogin(userData)
            res.should.be.true()
        })
        it('should be false', async () => {
            const altUser = {
                name: 'Anders',
                password: '20SA'
            }
            const res = await controller.correctLogin(altUser)
            res.should.be.false()
        })
        it('should be false 2', async () => {
            const correctUser = await createUser()
            const altUser = {
                name: correctUser.name,
                password: '20SA'
            }
            const res = await controller.correctLogin(altUser)
            res.should.be.false()
        })
    })
})
