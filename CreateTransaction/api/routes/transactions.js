const express = require('express')
const route = express.Router()

// Variables de entorno
const { api } = require('@/config')

// Instancia express
const createTransactionController = require(`@api/controllers/Http/CreateTransactionController`)
const createTransactionsRoute = new createTransactionController()

const validate = require(`@api/middlewares/Validate`)

module.exports = ({ app }) => {
  app.use('/transactions', route)
  // Rutas demo
  route.get(api.routeService, createTransactionsRoute.receive)
}
