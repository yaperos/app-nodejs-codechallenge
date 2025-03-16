import winston from "winston";
import "winston-daily-rotate-file";

// Función para crear un logger dinámico según el microservicio
export const createLogger = (serviceName: string) => {
    const consoleFormat = winston.format.printf(({ level, message }) => {
        return `[${serviceName} - ${level.toUpperCase()}] ${typeof message === "string" ? message : JSON.stringify(message)}`;
    });

    const fileFormat = winston.format.printf(({ level, message, timestamp }) => {
        const formattedMessage = typeof message === "string" ? message : JSON.stringify(message);
        return `[${serviceName} - ${timestamp}] ${level.toUpperCase()}: ${formattedMessage}`;
    });

    return winston.createLogger({
        level: "info",
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                    consoleFormat
                )
            }),
            new winston.transports.DailyRotateFile({
                // filename: `logs/${serviceName.toLowerCase()}-service-%DATE%.log`,  // Logs específicos por servicio
                filename: `logs/app-%DATE%.log`,  // Un solo log en desarrollo
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
};
