import {
    Catch,
    ExceptionFilter,
    ArgumentsHost,
    Logger,
    HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";
import { BusinessException } from "./business.exception";

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
    catch(exception: BusinessException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status = exception.getStatus
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
            // tslint:disable-next-line: no-console
            console.error(exception);
        }

        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toLocaleDateString(),
            error:
                status !== HttpStatus.INTERNAL_SERVER_ERROR
                    ? exception.message || exception.message || null
                    : "Internal server error",
        };

        // This is for REST petitions
        if (request) {
            const error = {
                ...errorResponse,
                path: request.url,
                method: request.method,
            };

            Logger.error(
                `${request.method} ${request.url}`,
                JSON.stringify(error),
                "ExceptionFilter",
            );

            response.status(status).json(errorResponse);
        }
    }
}