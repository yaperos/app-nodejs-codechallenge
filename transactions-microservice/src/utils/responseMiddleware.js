const { logger } = require('./logger')

const responseMiddleware = /** @type import('express').RequestHandler */ (req, res, next) => {
  const oldJson = res.json
  res.json = body => {
    logger.trace({
      statusCode: res.statusCode,
      responseBody: body,
    }, `${req.method} ${req.url} - Request finished END`)

    return oldJson.call(res, body)
  }
  next()
}

module.exports = responseMiddleware
