const express = require('express')
const router = express.Router()
const controller = require('../../controllers/concert-controller')

router
    .get('/concerts', getEndpoint)
    .get('/concerts/:id', getByIdEndpoint)
    .put('/concerts/:id', updateEndpoint)
    .post('/concerts/create', postEndpoint)
    .delete('/concerts/:id', deleteEndpoint)

router.use(errorHandler) // Middleware for error handling

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

async function getEndpoint(req, res, next) {
    await controller
        .getAll()
        .then((result) => {
            res.status(200).send(result)
        })
        .catch(next)
}

async function getByIdEndpoint(req, res, next) {
    await controller
        .getById(req.params.id)
        .then((result) => {
            res.status(200).send(result)
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
    // if (err.message === 'Contract validation failed: contractNumber: Path `contractNumber` is required.')
    //     res.status(422).send(err.message)
    if (err.name === 'CastError') res.status(422).send('Wrong id format')
    else res.status(500).send(err.message)
}

// Export

module.exports = router
