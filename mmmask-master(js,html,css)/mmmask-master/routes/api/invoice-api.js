const express = require('express')
const router = express.Router()
const controller = require('../../controllers/invoice-controller')

// Endpoints

router
    .get('/invoices', getInvoiceEndpoint)
    .post('/invoices/create', postInvoiceEndpoint)
    .delete('/invoices/:id', deleteEndpoint)

router.use(errorHandler) // Middleware for error handling

// Endpoint callback functions

async function getInvoiceEndpoint(req, res, next) {
    await controller
        .getAll()
        .then((result) => {
            res.status(200).send(result)
        })
        .catch(next)
}

async function postInvoiceEndpoint(req, res, next) {
    await controller
        .create(req.body)
        .then((result) => {
            res.status(201).send(result)
        })
        .catch(next)
}

async function deleteEndpoint(req, res, next) {
    await controller
        .delete(req.params.id)
        .then((result) => {
            if (!result) res.sendStatus(404)
            else res.status(200).send(result)
        })
        .catch(next)
}

// Error handler

function errorHandler(err, req, res, next) {
    // console.error(err.stack) // For debugging
    if (err.name === 'CastError') res.status(422).send('Wrong id format')
    else res.status(500).send(err.message)
}

// Export

module.exports = router