const express = require('express')
const router = express.Router()
const controllerCompany = require('../../controllers/standard-controller')

// Endpoints

router
    .get('/standard', getCompanyStandardEndpoint)
    .put('/standard/:id', updateCompanyStandardEndpoint)

router.use(errorHandler) // Middleware for error handling

// Endpoint callback functions

async function getCompanyStandardEndpoint(req, res, next) {
    await controllerCompany
        .get()
        .then((result) => {
            res.status(200).send(result)
        })
        .catch(next)
}


async function updateCompanyStandardEndpoint(req, res, next) {
    await controllerCompany
        .update(req.params.id, req.body)
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