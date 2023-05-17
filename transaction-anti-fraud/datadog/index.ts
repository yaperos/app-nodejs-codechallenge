import { createLogger, format, transports } from 'winston'

const httpTransportOptions = {
  host: 'http-intake.logs.us5.datadoghq.com',
  path: '/api/v2/logs?dd-api-key=2c44cdba42d7246c3d279918fd43cb8f&ddsource=nodejs&service=transaction-anti-fraud',
  ssl: true
};

export const logger = createLogger({
  level: 'info',
  exitOnError: false,
  format: format.json(),
  transports: [
    new transports.Http(httpTransportOptions),
  ],
});
