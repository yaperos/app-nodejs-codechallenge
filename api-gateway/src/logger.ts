import * as log4js from "log4js";
const logger = log4js.getLogger()

export const info = (msg:string) => {
    logger.level = 'info'
    logger.info(msg);
}

export default {
    info
}