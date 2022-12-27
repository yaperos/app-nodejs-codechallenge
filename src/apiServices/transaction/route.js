const { Router } = require('express')
const transaction = require('./controllers')
// const { check } = require('express-validator')

const router = Router()

router.post('/create', [], transaction)

module.exports = router
