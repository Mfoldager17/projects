const express = require('express')
const { log } = require('handlebars')
const router = express.Router()
const controller = require('../../controllers/bands-controller')

router
    .get('/', async (req, res) => {
        const bands = await controller.getAll()
        res.render('./bands/bands.hbs', { title: 'Bands', bands })
    })
    .get('/create', (req, res) => {
        res.render('./bands/band.hbs', { title: 'Opret band' })
    })
    .get('/edit', async (req, res) => {
        const band = await controller.get(req.query.id)
        if (band) res.render('./bands/band.hbs', { band })
        else res.sendStatus(404)
    })

module.exports = router
