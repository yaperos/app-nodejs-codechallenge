import * as log4js from "log4js";

const logger = log4js.getLogger()

export const info = (msg:string) => {
    logger.level = 'info'
    logger.info(msg);
}

export const error = (msg:string) => {
    logger.level = 'error'
    logger.error(msg);
}

export default {
    info,
    error
}