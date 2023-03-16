'use strict'
require(`winston-daily-rotate-file`)
const config = require('@/config');
const { createLogger, format, transports, config: confWins } = require(`winston`)
const { combine, timestamp, label, printf } = format

const myFormat = printf(({ level, message, label: labelText, timestamp: timestampFormat }) => {
  return `${timestampFormat} [${labelText}] ${level}: ${message}`
})

const timezoned = () => new Date().toLocaleString(`es-MX`, { timeZone: `America/Lima` })

class Winston {
  constructor (lbl) {
    this.logger = createLogger({
      level: config.logs.level,
      levels: confWins.npm.levels,
      format: combine(
        label({ label: lbl }),
        timestamp({ format: timezoned() }),
        myFormat
      ),
      transports: [
        new transports.Console({
          colorize: true,
          name: `console`,
          prettyPrint: true
        }),
        new transports.DailyRotateFile({
          filename: `logs/audit-runtime-%DATE%.log`,
          datePattern: `YYYY-MM-DD`,
          maxSize: `50m`,
          maxFiles: `3d`
        })
      ]
    })
  }

  info (message) {
    this.logger.info(message)
  }
  
  error (message) {
    this.logger.error(message)
  }

  warning (message) {
    this.logger.warn(message)
  }
}

module.exports = lbl => new Winston(lbl)
