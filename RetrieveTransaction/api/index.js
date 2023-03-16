const express = require('express')
const expressRouter = require('./routes/express')
const { Router } = express

// Inject routes
module.exports = () => {
  const app = Router()
  expressRouter({ app })

  return app
}