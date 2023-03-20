const express = require('express')
const route = express.Router()

// Instancia express
const createTransactionController = require(`@api/controllers/Http/CreateTransactionController`)
const createTransactionsRoute = new createTransactionController()

module.exports = ({ app }) => {
  app.use('/transactions', route)
  // Rutas demo
  route.get('/create/:transactions', createTransactionsRoute.receive)
}
