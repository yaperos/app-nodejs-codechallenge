enum LogLevel{
    ERROR = "ERROR",
    DEBUG = "DEBUG",
    WARN = "WARN"
}
enum LogColor{
    ERROR="\x1b[31m",
    DEBUG="\x1b[32m",
    WARN="\x1b[33m"

}

function extractDateWithFormat(): string { 
    const dt = new Date()
    return `${dt.getFullYear()}/${dt.getMonth()}/${dt.getDay()} - ${dt.getHours()}:${dt.getUTCMinutes()}`
}

function formatLogPrint(level: LogLevel, message: string, at?: string): string {
    const atLocation = at ? `-[${at}] ` : '';
    const levelType = `${LogColor[level]}[${level}]\x1b[0m`
    return `${levelType}${atLocation}: (${extractDateWithFormat()}) ${message}`;
}

function logError(error: any | string, at?: string): void {
    console.debug(formatLogPrint(LogLevel.ERROR, error, at));
}

function logDebug(message: string, at?: string): void {
    console.debug(formatLogPrint(LogLevel.DEBUG, message, at));
}


export default {logDebug, logError};