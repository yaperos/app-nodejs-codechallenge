import pino from "pino";
import { env } from "./env.js";

// Central logger with environment-aware formatting
export const logger = pino({
  level: env.LOG_LEVEL,
  transport:
    env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname"
          }
        }
      : undefined
});

// Creates contextual loggers for request or job scoped metadata
export const createLogger = (context: pino.Bindings) => logger.child(context);
