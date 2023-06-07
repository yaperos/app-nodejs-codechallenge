import {
    Catch,
    ExceptionFilter,
    HttpException,
    ArgumentsHost,
    Logger,
    HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";
import { GqlArgumentsHost, GqlContextType, GqlExceptionFilter } from "@nestjs/graphql";
import { GraphQLResolveInfo } from "graphql";
import { BusinessException } from "./business.exception";

@Catch()
export class HttpErrorFilter implements ExceptionFilter, GqlExceptionFilter {
    catch(exception: BusinessException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        //const gqlContext = host.switchToHttp().getNext<GqlContextType>();

        const gqlHost = GqlArgumentsHost.create(host);
        const info = gqlHost.getInfo<GraphQLResolveInfo>();

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

        /*if (gqlContext) {
            const { message } = exception.getResponse() as { message: any[] };
        }*/

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
        } else {
            // This is for GRAPHQL petitions
            if (typeof exception.getResponse === 'function') {
                const { message } = exception.getResponse() as { message: any[] };
            }
            const error = {
                ...errorResponse,
                type: info.parentType,
                field: info.fieldName,
            };

            Logger.error(
                `${info.parentType} ${info.fieldName}`,
                JSON.stringify(error),
                "ExceptionFilter",
            );
            console.log(exception);
            return exception;
        }
    }
}