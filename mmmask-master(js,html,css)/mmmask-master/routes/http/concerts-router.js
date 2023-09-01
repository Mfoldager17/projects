const express = require('express')
const router = express.Router()
const concertController = require('../../controllers/concert-controller')
const bandController = require('../../controllers/bands-controller')
const promoterController = require('../../controllers/promoter-controller')
const venueController = require('../../controllers/venue-controller')

router
    .get('/', async function (req, res) {
        const bands = await bandController.getAll()
        const concerts = await concertController.getAll()
        res.render('./concerts/concerts.hbs', { title: 'Koncerter', bands, concerts })
    })
    .get('/create', async function (req, res) {
        // Accepts following queries: bandId=xxx&venueId=yyy&tourId=zzz
        const { bandId, venueId, tourId } = req.query
        let band, venue
        if (bandId) band = await bandController.get(bandId)
        if (venueId) venue = await venueController.getById(venueId)

        const bands = await bandController.getAll()
        const promoters = await promoterController.getAll()
        const venues = await venueController.getAll()
        res.render('./concerts/concert.hbs', { bands, promoters, band, venue, tourId, venues })
    })
    .get('/:id', async function (req, res) {
        const concert = await concertController.getById(req.params.id)
        if (concert) {
            res.render('./concerts/concert.hbs', { concert })
        } else res.sendStatus(404)
    })

module.exports = router
