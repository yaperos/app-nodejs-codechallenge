const { createLogger, format, transports, level } = require('winston');
const dayjs = require('dayjs');

const now = dayjs();
const fecha = now.format('DD/MM/YYYY hh:mm:ss a')

const logger = createLogger({

    transports: [
        new transports.File({
            maxsize: 5120000,
            maxFiles: 5,
            filename: './logger/report.log'
        }),
        new transports.Console({
            level: 'debug',
            format: format.combine(format.simple())
        })
    ]
});

const logRequest = async(req) => {

    const header = {
        date: fecha,
        host: req.headers.host,
        origin: req.headers.origin,
        referer: req.headers.referer,
        userAgent: req.headers['user-agent']
    };

    logger.info(
        `{ 'Date': '${header.date}', 'Message': { 'tipo': 'REQUEST', 'Host': '${header.host}', 'Origin': '${header.origin}', 'Endpoint': '${header.referer}', 'UserAgent': '${header.userAgent}' } }`
    );
};

const logError = async(controller, req, error) => {

    const header = {
        date: fecha,
        host: req.headers.host,
        origin: req.headers.origin,
        referer: req.headers ? req.headers.referer : req,
        userAgent: req.headers['user-agent']
    };

    logger.error(
        `{ 'Date': '${header.date}',` +
        ` 'Host': '${header.host}',` +
        ` 'Origin': '${header.origin}',` +
        ` 'Endpoint': '${header.referer}',` +
        ` 'UserAgent': '${header.userAgent}',` +
        ` 'Controller': '${controller}',` +
        ` 'Error': '${error}' }`
    );
};

module.exports = {
    logRequest,
    logError
}