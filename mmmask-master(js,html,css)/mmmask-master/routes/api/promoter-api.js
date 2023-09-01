const express = require('express')
const router = express.Router()
const controller = require('../../controllers/promoter-controller')

// Endpoints

router
    .post('/promoters', postEndpoint)
    .put('/promoters/:id', updateEndpoint)
    .delete('/promoters/:id', deleteEndpoint)

router.use(errorHandler) // Middleware for error handling

// Endpoint callback functions

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
    if (err.message === 'Promoter validation failed: name: Path `name` is required.') res.status(422).send(err.message)
    else if (err.name === 'CastError') res.status(422).send('Wrong id format')
    else if (err.message.match(/^E11000/)) res.status(409).send('Duplicate property')
    else res.status(500).send(err.message)
}

// Export

module.exports = router
