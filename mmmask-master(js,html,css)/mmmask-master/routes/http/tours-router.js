const express = require('express')
const router = express.Router()
const controller = require('../../controllers/tour-controller')
const bandsController = require('../../controllers/bands-controller')
const venueController = require('../../controllers/venue-controller')

router
    .get('/', async (req, res) => {
        const tours = await controller.getTours()
        const bands = await bandsController.getAll()
        res.render('./tours/tours.hbs', { title: 'Turnéer', tours, bands })
    })
    .get('/:id', async (req, res) => {
        const tour = await controller.getById(req.params.id)
        var venues = await venueController.getAll()
        // Only filter venues if tour has venues already
        if (tour.bruttoList) {
            venues = venues.filter(
                (venue) => !tour.bruttoList.find((btListTour) => venue._id.toString() === btListTour._id.toString())
            )
        }
        if (tour) res.render('./tours/tour.hbs', { title: 'Rediger tour', tour, venues })
        else res.sendStatus(404)
    })

module.exports = router
