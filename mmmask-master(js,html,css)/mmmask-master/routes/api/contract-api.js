const express = require('express')
const router = express.Router()
const controller = require('../../controllers/contracts-controller')

// Endpoints

router
    .get('/contracts', getEndpoint)
    .post('/contract/create', postEndpoint)
    .put('/contract/edit/:id', updateEndpoint)
    .delete('/contract/:id', deleteEndpoint)

router.use(errorHandler) // Middleware for error handling

// Endpoint callback functions

async function getEndpoint(req, res, next) {
    await controller
        .getAll()
        .then((result) => {
            res.status(200).send(result)
        })
        .catch(next)
}

async function postEndpoint(req, res, next) {
    await controller
        .create(req.body)
        .then((result) => {
            res.status(201).send(result)
        })
        .catch(next)
}

async function updateEndpoint(req, res, next) {
    await controller
        .update(req.params.id, req.body)
        .then((result) => {
            if (!result) res.sendStatus(404)
            else res.status(200).send(result)
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
    if (err.message === 'Contract validation failed: contractNumber: Path `contractNumber` is required.')
        res.status(422).send(err.message)
    else if (err.name === 'CastError') res.status(422).send('Wrong id format')
    else res.status(500).send(err.message)
}

// Export

module.exports = router
