import winston from "winston";
let logger = null;

if (!logger) {
  let transports = [];
  if (process.env.LOG_FILE === "true") {
    transports = [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: `./logs/${process.env.APP_NAME}.log`,
      }),
    ];
  } else {
    transports = [new winston.transports.Console()];
  }

  logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports,
  });
  logger.info("Logger instance created");
}

export default logger;
