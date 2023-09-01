const express = require('express')
const router = express.Router()
const controller = require('../../controllers/venue-controller')

router
    .get('/venues', getAllEndpoint)
    .get('/venues/:id', getByIdEndpoint)
    .post('/venues/create', postEndpoint)
    .put('/venues/:id', updateEndpoint)
    .delete('/venues/:id', deleteEndpoint)

router.use(errorHandler)

async function getAllEndpoint(req, res, next) {
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

function errorHandler(err, req, res, next) {
    console.log(err.message)
    if (err.message === 'Venue validation failed: name: Path `name` is required') res.status(422).send(err.message)
    else if (err.name === 'CastError') res.status(422).send('Wrong id format')
    else if (err.message.match(/^E11000/)) res.status(409).send('Duplicate property')
    else res.status(500).send(err.message)
}

module.exports = router
