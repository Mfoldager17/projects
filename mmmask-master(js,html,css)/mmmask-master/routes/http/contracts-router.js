const express = require('express')
const router = express.Router()
const controller = require('../../controllers/contracts-controller')
const concertsController = require('../../controllers/concert-controller')

// Endpoints

router
    .get('/', contractsEndpoint)
    .get('/:id', contractIdEndpoint)
    .get('/create/new', createEndpoint)

// Endpoint functions

async function contractsEndpoint(req, res) {
    const contracts = await controller.getAll()
    res.render('./contracts/contracts.hbs', {title: 'Kontrakter', contracts })
}

async function contractIdEndpoint(req, res) {
    const contract = await controller.getById(req.params.id)
    if (contract) res.render('./contracts/contract.hbs', { contract })
    else res.sendStatus(404) // TODO: Fix
}

async function createEndpoint(req, res) {
    const concerts = await concertsController.getAll()
    res.render('./contracts/contract.hbs', {concerts})
}

//

module.exports = router
