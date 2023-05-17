"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = require("winston");
const httpTransportOptions = {
    host: 'http-intake.logs.us5.datadoghq.com',
    path: '/api/v2/logs?dd-api-key=2c44cdba42d7246c3d279918fd43cb8f&ddsource=nodejs&service=transactions',
    ssl: true
};
exports.logger = (0, winston_1.createLogger)({
    level: 'info',
    exitOnError: false,
    format: winston_1.format.json(),
    transports: [
        new winston_1.transports.Http(httpTransportOptions),
    ],
});
//# sourceMappingURL=index.js.map