const express = require('express')
const router = express.Router()
const controller = require('../../controllers/invoice-controller')
const controllerContract = require('../../controllers/contracts-controller')
const controllerStandard = require('../../controllers/standard-controller')

// Endpoints

router
    .get('/', invoicesEndpoint)
    .get('/:id', invoicesIdEndpoint)
    .get('/create/:id', createWithContractEndpoint)

// Endpoint functions

async function invoicesEndpoint(req, res) {
    const invoices = await controller.getAll()
    res.render('./invoices/invoices.hbs', { title: 'Faktura', invoices })
}

async function invoicesIdEndpoint(req, res) {
    if (req.params.id === 'create') {
        const standards = await controllerStandard.get()
        const standard = standards[0]
        res.render('./invoices/invoice.hbs', { title: 'Opret faktura', standard })
    } else {
        const invoice = await controller.getInvoiceById(req.params.id)
        if (invoice) res.render('./invoices/invoice.hbs', { invoice })
        else res.sendStatus(404)
    }
}

async function createWithContractEndpoint(req, res) {
    const contract = await controllerContract.getContractById(req.params.id)
    if (contract) {
        const standards = await controllerStandard.get()
        const standard = standards[0]
        res.render('./invoices/invoice.hbs', {
            title: `Opret faktura til '${contract.concert.promoter.name}'`,
            contract,
            standard
        })
    } else res.sendStatus(402)
}

//

module.exports = router
