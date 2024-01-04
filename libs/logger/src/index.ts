import { Logger, createLogger, format, transports } from "winston"

export function createRequestLogger (stream: NodeJS.WritableStream): Logger {
  return createLogger({
    transports: [new transports.Stream({ stream })],
    format: format.combine(
      format.colorize(),
      format.timestamp(),
      format.printf(({ timestamp, level, message }) => {
        const {req, res, err} = message
        const origin = `${req.method} ${req.path}`
        const msg = err ? (err.stack || err.message) : JSON.stringify(req.body ?? '')
        return `[${timestamp}] ${level}: ${origin} ${msg}`
      })
    )
  })
}

export function createCommonLogger(stream: NodeJS.WritableStream): Logger {
  return createLogger({
    transports: [new transports.Stream({ stream })],
    format: format.combine(
      format.colorize(),
      format.timestamp(),
      format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level}: ${message}`;
      })
    )
  })
}
