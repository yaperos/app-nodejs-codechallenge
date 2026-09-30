import { randomUUID } from 'node:crypto';
import { Logger } from '@nestjs/common';
import type { NextFunction, Request, RequestHandler, Response } from 'express';

export const CORRELATION_HEADER = 'x-correlation-id';


export function correlationId(req: Request, res: Response, next: NextFunction): void {
    const incoming = req.header(CORRELATION_HEADER);
    const id = incoming && /^[\w-]{8,64}$/.test(incoming) ? incoming : randomUUID();
    req.headers[CORRELATION_HEADER] = id;
    res.setHeader(CORRELATION_HEADER, id);
    next();
}

export function accessLog(): RequestHandler {
    const logger = new Logger('HTTP');
    return (req, res, next) => {
        const start = process.hrtime.bigint();
        res.on('finish', () => {
            const ms = Number(process.hrtime.bigint() - start) / 1e6;
            logger.log(
                `${req.method} ${req.originalUrl} ${res.statusCode} ${ms.toFixed(1)}ms cid=${String(req.headers[CORRELATION_HEADER])}`,
            );
        });
        next();
    };
}