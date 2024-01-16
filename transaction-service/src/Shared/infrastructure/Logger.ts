enum LogLevel {
    WARNING = 'WARNING',
    ERROR = 'ERROR',
    CRITICAL = 'CRITICAL',
    DEBUG = 'DEBUG'
}

interface LogMessage {
    date: Date;
    message: string;
    level: LogLevel;
}

class Logger {
    logMessages: LogMessage[] = [];

    log(message: string, level: LogLevel): void {
        const logEntry: LogMessage = {
            date: new Date(),
            message,
            level
        };

        this.logMessages.push(logEntry);
        console.log(`[${logEntry.date.toISOString()}] [${logEntry.level}]: ${logEntry.message}`);
    }

    warning(message: string): void {
        this.log(message, LogLevel.WARNING);
    }

    error(message: string): void {
        this.log(message, LogLevel.ERROR);
    }

    critical(message: string): void {
        this.log(message, LogLevel.CRITICAL);
    }

    debug(message: string): void {
        this.log(message, LogLevel.DEBUG);
    }
}

export { Logger, LogLevel };