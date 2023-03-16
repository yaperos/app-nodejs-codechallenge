const express = require('express')
const route = express.Router()

// Variables de entorno
const { api } = require('@/config')

// Instancia express
const expressController = require(`@api/controllers/Http/ExpressController`)
const expressRoutes = new expressController()

const validate = require(`@api/middlewares/Validate`)

module.exports = ({ app }) => {
  app.use('/', route)
  // Rutas demo
  route.get(api.routeService, expressRoutes.receive)
}
