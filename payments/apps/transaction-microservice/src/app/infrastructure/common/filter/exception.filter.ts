import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, HttpStatus, LoggerService, RpcExceptionFilter } from "@nestjs/common";
import { BaseRpcExceptionFilter, RpcException } from "@nestjs/microservices";
import { Observable, of } from "rxjs";

interface IError {
    message: string;
    code_error: string;
}

@Catch()
export class AllExceptionFilter extends BaseRpcExceptionFilter {
    constructor(private readonly logger: LoggerService) {
        super();
    }

    catch(exception: any, host: ArgumentsHost) {
        console.log('entro a exception');
        const message =
            exception instanceof HttpException
                ? (exception.getResponse() as IError)
                : { message: (exception as Error).message, code_error: exception.statusCode === undefined ? 500 : exception.statusCode };

        const responseData = {
            ...{
                statusCode: exception.statusCode === undefined ? 500 : exception.statusCode,
                timestamp: new Date().toISOString(),
            },
            ...message,
        };
        return of(responseData);
    }
}