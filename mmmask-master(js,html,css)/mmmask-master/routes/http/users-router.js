const express = require('express')
const router = express.Router()
const controller = require('../../controllers/users-controller')

router
    .get('/', async (req, res) => {
        // const correctUser = await createUser()
        // res = await controller.correctLogin(userData)
        res.render('./login.hbs', { title: 'Login' })
    })
    .post('/', async (req, res) => {
        const isCorrectLogin = await controller.correctLogin(req.body)
        if (isCorrectLogin) {
            req.session.authenticated = true
            res.status(200).send({ authenticated: true })
        } else {
            // not authenticated
            res.status(400).redirect('/')
        }
    })
    .get('/logout', async (req, res) => {
        req.session.destroy((err) => {
            if (err) res.status(400).redirect('/')
            else res.redirect('/login')
        })
    })
//TODO: POST

module.exports = router
