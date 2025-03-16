import winston from 'winston';

const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Configuración del logger
const logger = winston.createLogger({
  level: 'info', 
  format: winston.format.combine(
    winston.format.timestamp(),
    logFormat
  ),
  transports: [
    new winston.transports.Console(), 
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }) 
  ]
});

export const LogService = {
  info: (message: string) => logger.info(message),
  warn: (message: string) => logger.warn(message),
  error: (message: string, error?: any) => {
    const errorDetails = error ? `${message} | Detalles: ${error.stack || error}` : message;
    logger.error(errorDetails);
  }
};
