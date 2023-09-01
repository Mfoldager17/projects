require('should')
const config = require('../config')

// Template
describe('Filnavn her', function () {
    describe('Metode/funktion der tester', function () {
        it('Forventet resultalt', function () {})
    })
})

// Example
describe('template-test', function () { 
    describe('config.localPort', function () { 
        it('should be equal to 8080', function () {
            config.localPort.should.be.equal(8080)
        })
    })
})
