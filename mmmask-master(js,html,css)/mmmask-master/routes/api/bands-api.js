const express = require('express')
const router = express.Router()
const controller = require('../../controllers/bands-controller')

// Endpoints

router
    .get('/bands', getEndpoint)
    .post('/bands', postEndpoint)
    .put('/bands/:id', updateEndpoint)
    .delete('/bands/:id', deleteEndpoint)

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
    if (err.message === 'Band validation failed: name: Path `name` is required.') res.status(422).send(err.message)
    else if (err.name === 'CastError') res.status(422).send('Wrong id format')
    else res.status(500).send(err.message)
}

// Export

module.exports = router
