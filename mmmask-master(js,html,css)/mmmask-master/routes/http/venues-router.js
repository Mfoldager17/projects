const express = require('express')
const router = express.Router()
const venueController = require('../../controllers/venue-controller')

router
    .get('/', async function (req, res) {
        const venues = await venueController.getAll()
        res.render('./venues/venues.hbs', { venues })
    })
    .get('/create', async function (req, res) {
        res.render('./venues/venue.hbs', {})
    })
    .get('/:id', async function (req, res) {
        const venue = await venueController.getById(req.params.id)
        if (venue) {
            res.render('./venues/venue.hbs', { venue })
        } else {
            res.status(404)
        }
    })

module.exports = router
