const { createLogger, format, transports } = require('winston')

const httpTransportOptions = {
  host: 'http-intake.logs.us5.datadoghq.com',
  path: '/api/v2/logs?dd-api-key=2c44cdba42d7246c3d279918fd43cb8f&ddsource=nodejs&service=fake-generator-transaction',
  ssl: true
};

 const logger = createLogger({
  level: 'info',
  exitOnError: false,
  format: format.json(),
  transports: [
    new transports.Http(httpTransportOptions),
  ],
});

module.exports = {
  logger
}
