import logger from "pino";

/**
 * Config for a pretty log in the development phase
 *
 * @name _logger
 * */
export const _logger = logger({
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
        },
    },
    base: {
        pid: false,
    },
});
