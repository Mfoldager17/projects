const express = require('express')
const router = express.Router()
const controller = require('../../controllers/token-controller')

router.post('/token', (req, res) => {
    try {
        const { urlpath, expirationInDays } = req.body
        const token = controller.generateToken(urlpath, expirationInDays)
        res.status(201).json(token)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

module.exports = router
