const express = require('express')
const router = express.Router()
const controller = require('../../controllers/standard-controller')

// Endpoints

router.get('/', contractsEndpoint)

// Endpoint functions

async function contractsEndpoint(req, res) {
    const standards = await controller.get()
    const standard = standards[0]
    res.render('./invoices/standard.hbs', { standard })
}

//

module.exports = router
