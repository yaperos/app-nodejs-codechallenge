import { type ArgumentsHost, Catch, type ExceptionFilter } from '@nestjs/common';
import type { Response } from 'express';
import {
    DomainError,
    InvalidStatusTransitionError,
    TransactionNotFoundError,
} from '../../../domain/errors/domain.errors';

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
    catch(exception: DomainError, host: ArgumentsHost): void {
        const response = host.switchToHttp().getResponse<Response>();
        const statusCode =
            exception instanceof TransactionNotFoundError
                ? 404
                : exception instanceof InvalidStatusTransitionError
                    ? 409
                    : 422;

        response.status(statusCode).json({
            statusCode,
            error: exception.name,
            message: exception.message,
        });
    }
}