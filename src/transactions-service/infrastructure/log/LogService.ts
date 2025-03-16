import winston from "winston";
import "winston-daily-rotate-file";

// Variable de etiqueta para microservicio
const LOG_TRANSACTION = process.env.LOG_TRANSACTION || 'TRX';

// Formato de Consola
const consoleFormat = winston.format.printf(({ level, message }) => {
  return `[${LOG_TRANSACTION} - ${level.toUpperCase()}] ${typeof message === "string" ? message : JSON.stringify(message)}`;
});

// Formato de Archivo
const fileFormat = winston.format.printf(({ level, message, timestamp }) => {
  const formattedMessage = typeof message === "string" ? message : JSON.stringify(message);
  return `[${LOG_TRANSACTION} - ${timestamp}] ${level.toUpperCase()}: ${formattedMessage}`;
});

const LogService = winston.createLogger({
  level: "info",
  transports: [
      new winston.transports.Console({
          format: winston.format.combine(
              winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
              consoleFormat
          )
      }),
      new winston.transports.DailyRotateFile({
          filename: "logs/transactions-service-%DATE%.log",
          datePattern: "YYYY-MM-DD",
          maxSize: "20m",
          maxFiles: "14d",
          format: winston.format.combine(
              winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
              fileFormat
          )
      })
  ]
});

export { LogService };
