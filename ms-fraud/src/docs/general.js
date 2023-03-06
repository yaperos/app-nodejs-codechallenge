'use stric'
const {config} = require('../common/config/env.config')
const general = {
  routePrefix: '/api/extranet/doc',
  swagger: {
    openapi: '3.0.0',
    info: {
      title: 'Api Extranet',
      description: 'Documentación de las rutas de extranet',
      version: '0.1.0'
    },
    host: `${config.apiEndpoint}:${config.port}`,
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'inquire', description: 'Endpoints extranet' }
    ],
    securityDefinitions: {
      apiKey: {
        type: 'apiKey',
        name: 'apiKey',
        in: 'header'
      }
    }
  },
  exposeRoute: true
}

module.exports = general
