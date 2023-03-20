const express = require('express')
const route = express.Router()

// Instancia express
const TransactionsController = require(`@api/controllers/Http/TransactionsController`)
const transactionsRoute = new TransactionsController()

module.exports = ({ app }) => {
  app.use('/transactions', route)
  // Rutas demo
  route.get('/getAll', transactionsRoute.receive)
}
