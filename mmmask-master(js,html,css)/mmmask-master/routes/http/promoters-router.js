const express = require('express')
const router = express.Router()
const controller = require('../../controllers/promoter-controller')

router
    .get('/', async (req, res) => {
        const promoters = await controller.getAll()
        res.render('./promoters.hbs', { promoters, title: 'Arrangører' })
    })
    .get('/create', async (req, res) => {
        const promoters = await controller.getAll()
        res.render('./promoters.hbs', { promoters })
    })
    .get('/edit', async (req, res) => {
        const promoters = await controller.getAll()
        res.render('./promoters.hbs', { promoters })
    })

module.exports = router
