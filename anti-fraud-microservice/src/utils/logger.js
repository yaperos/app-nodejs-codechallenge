const { pino } = require('pino')

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
const logger = pino({
  level: 'trace',
  base: undefined, // remove pid and hostname
}, transport)

module.exports = {
  logger,
}
