/* eslint-disable no-unused-vars */

const verror = require('verror')
const createHttpError = require('http-errors')
const { logger } = require('./logger')

const { WError } = verror

const errorMiddleware = /** @type {import('express').ErrorRequestHandler} */ (err, _req, res, next) => {
  logger.error(err)
  const errRequest = new WError(err, 'Ocurrió un error al procesar la solicitud')

  if (err.error?.isJoi) {
    const { error } = err
    res.status(400).json({
      name: error.name,
      message: `Error validating request ${err.type}. ${error.message}.`,
      isOperational: true,
    })
    return
  }

  if (!createHttpError.isHttpError(err)) {
    res.status(500).json({
      name: err instanceof Error ? err.name : 'Error',
      error: errRequest.message,
      isOperational: false,
    })
    return
  }

  // by default error >=500 are not exposed
  res.status(err.statusCode).json({
    name: err.name,
    error: err.expose ? err.message : errRequest.message,
    info: err.expose ? err.info : undefined,
    isOperational: true,
  })
}

module.exports = errorMiddleware
