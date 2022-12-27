import { format, createLogger, transports } from 'winston'

const { combine, timestamp, label, printf, cli } = format

const customFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`
})

export const logger = createLogger({
  level: 'debug',
  format: combine(label({ label: 'GATEWAY' }), timestamp(), cli(), customFormat),
  transports: [new transports.Console()],
})
