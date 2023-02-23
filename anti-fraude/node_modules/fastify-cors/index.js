'use strict'

const warning = require('process-warning')()
warning.create('FastifyWarning.fastify-cors', 'FST_MODULE_DEP_fastify-cors'.toUpperCase(), 'fastify-cors has been deprecated. Use @fastify/cors@7.0.0 instead.')
warning.emit('FST_MODULE_DEP_fastify-cors'.toUpperCase())

module.exports = require('fastify-cors-deprecated')
