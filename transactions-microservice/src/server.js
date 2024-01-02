const http = require('http')
const express = require('express')

const transactionsRouters = require('./routes/transactions')
const { loggerMiddleware } = require('./utils/logger')
const errorMiddleware = require('./utils/errorMiddleware')
const responseMiddleware = require('./utils/responseMiddleware')
const { SERVER_ENV } = require('./consts')
const { initProducer, initConsumer } = require('./libs/kafka')
const processMessageBroker = require('./broker/processMessageBroker')

const app = express()
app.use(express.json())
app.use(responseMiddleware)
app.use(loggerMiddleware)

app.use('/transactions', transactionsRouters)
app.use('/', (req, res) => {
  res.send('api status: ok')
})
app.use(errorMiddleware)

const server = http.createServer(app)
const port = SERVER_ENV.PORT
server.listen(port, () => {
  console.debug('--------------------------------------------------')
  console.debug(`Server "${SERVER_ENV.NAME}" listening on port ${port} 🚀`)
  console.debug(`Node version ${process.version}`)
  console.debug('--------------------------------------------------')
})

initProducer()
initConsumer(processMessageBroker)
