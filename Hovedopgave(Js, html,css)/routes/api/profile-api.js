const express = require('express')
const router = express.Router()
const controller = require('../../controllers/profile-controller')

// ENDPOINTS

router
    .post('/profiles', postEndpoint)
    .get('/profiles/:utNumber', getFromUTEndpoint)
    .put('/profiles/:utNumber', updateEndpoint)
    .delete('/profiles/:utNumber', deleteEndpoint)


// Endpoint callback functions

// post Endpoint to create new profile
async function postEndpoint(req, res, next) {
    await controller
        .create(req.body)
        .then((result) => {
            res.status(201).send(result)
        })
        .catch(next)
}

// Get endpoint to get a profile from it's UT number
async function getFromUTEndpoint(req, res, next) {
    await controller
        .getByUTNumber(req.params.utNumber)
        .then((result) => {
            if (!result) res.send({}) // Denne metode returnere ofte ikke noget, derfor en grim, men funktionel løsning, for at det kan lykkes
            else res.status(200).send(result)
        })
        .catch(next)
}

async function updateEndpoint(req, res, next) {
    await controller
        .findOneAndUpdate(req.params.utNumber, req.body)
        .then((result) => {
            if (!result) res.sendStatus(404)
            else res.status(200).send(result)
        })
        .catch(next)
}

async function deleteEndpoint(req, res, next) {
    await controller
        .delete(req.params.utNumber)
        .then((result) => {
            if (!result) res.sendStatus(404)
            else res.status(200).send(result)
        })
        .catch(next)
}


module.exports = router

