'use strict'

module.exports = function (app, opts, next) {
  app.get('/', (req, reply) => { reply.send('d') })
  next()
}
