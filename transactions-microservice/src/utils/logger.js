const crypto = require('crypto')
const { pino } = require('pino')

const contextStorage = require('./asyncContext')

const transport = pino.transport({
  targets: [
    {
      level: process.env.PINO_LOG_LEVEL ?? 'trace',
      target: 'pino-pretty',
      options: {
        colorize: true,
        singleLine: true,
        translateTime: 'SYS:standard',
      },
    },
  ],
})

// Create a logging instance
const originalLogger = pino({
  level: 'trace',
  base: undefined, // remove pid and hostname
}, transport)

// Proxify logger instance to use child logger from context if it exists
const logger = new Proxy(originalLogger, {
  get (target, property, receiver) {
    const store = contextStorage?.getStore()
    const targetLogger = store?.get('logger') ?? target
    return Reflect.get(targetLogger, property, receiver)
  },
})

/**
 * Generate a unique ID for each incoming request and store a child logger in context
 * to always log the request ID
 */
const loggerMiddleware = /** @type import('express').RequestHandler */ async (req, res, next) => {
  const childLogger = originalLogger.child({
    requestId: crypto.randomUUID(),
    source: `${req.method} - ${req.url}`,
  })
  const contextStore = new Map()
  contextStore.set('logger', childLogger)

  childLogger.trace({
    body: req.body,
    query: req.query,
    params: req.params,
    origin: req.headers.origin,
    authorization: req.headers.authorization,
  }, `${req.method} ${req.url} - Request started START`)

  // @ts-ignore
  await contextStorage.run(contextStore, next)
}

module.exports = {
  logger,
  loggerMiddleware,
}
