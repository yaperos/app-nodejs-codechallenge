const express = require('express')
const expressRouter = require('./routes/express')
const transactionsRouter = require('./routes/transactions')
const { Router } = express

// Inject routes
module.exports = () => {
  const app = Router()
  expressRouter({ app })
  transactionsRouter({ app })

  return app
}