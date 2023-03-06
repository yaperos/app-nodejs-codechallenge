'use strict'
const general = require('../../docs/general')
const {config} = require('../../common/config/env.config')

// controllers
const homeController = require('./controllers/homeController')
const transactionCreateController = require('./controllers/transactionCreateController')
const transactionsListController = require('./controllers/transactionsListController')
// const transactionGetController = require('./controllers/transactionGetController')
// const transactionUpdateController = require('./controllers/transactionUpdateController')
// const transactionDeleteController = require('./controllers/transactionDeleteController')

// schemes
const transactionCreateScheme = require('./scheme/transactionCreateScheme')
const transactionsListScheme = require('./scheme/transactionsListScheme')
// const transactionGetScheme = require('./scheme/transactionGetScheme')
// const transactionUpdateScheme = require('./scheme/transactionUpdateScheme.js')
// const transactionDeleteScheme = require('./scheme/transactionDeleteScheme')

const path = require('path')
const fastify = require('fastify')({ logger: true })
// const fileUpload = require('fastify-file-upload')
// fastify.register(fileUpload, {
//   limits: { fileSize: 50 * 1024 * 1024 },
// })

fastify.register(require('@fastify/static'), {
  root: path.join(__dirname.replace("src/interfaces/rest",""), 'public'),
  prefix: '/api/extranet/public/'
})
fastify.register(require('@fastify/formbody'))
fastify.register(require('@fastify/cors'), { origin: '*' });

fastify.addHook('onRoute', opts => {
  if (opts.path === '/') {
    opts.logLevel = 'silent'
  }
})

const buildFastify = async () => {
  // documentation
  fastify.register(require('@fastify/swagger'), general)
  fastify.register(require('@fastify/routes'))

  // routes
  const pathMain = '/ms-transactions/'
  fastify.get(pathMain, homeController)
  fastify.get(pathMain + 'transactions', { schema: transactionsListScheme }, transactionsListController)
  fastify.post(pathMain + 'transactions', { schema: transactionCreateScheme }, transactionCreateController)
  // fastify.get(pathMain + 'transactions/:transactionId', { schema: transactionGetScheme }, transactionGetController)
  // fastify.put(pathMain + 'transactions/:transactionId', { schema: transactionUpdateScheme }, transactionUpdateController)
  // fastify.delete(pathMain + 'transactions/:transactionId', { schema: transactionDeleteScheme }, transactionDeleteController)

  // server
  fastify.listen({ port: config.port }, (err) => {
    if (err) {
      fastify.log.error(err)
    }
    fastify.log.info(`server listening on ${config.port}`)
    fastify.swagger()
  })
  return fastify
}

module.exports = buildFastify
