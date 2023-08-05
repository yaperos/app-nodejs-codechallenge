import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { loggers } from 'winston';

import { ErrorResponse } from '../response';
import { ErrorOptions } from '../util/error-options';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const status = exception.getStatus ? exception.getStatus() : 500;
		const request = ctx.getRequest<Request>();
		const logger = loggers.get('winston-logger');

		let objError = new ErrorResponse();
		// rome-ignore lint/suspicious/noDoubleEquals: <explanation>
if  (status == HttpStatus.NO_CONTENT) objError = ErrorOptions.noContent(logger, request, exception);
// rome-ignore lint/suspicious/noDoubleEquals: <explanation>
		if (status == HttpStatus.BAD_REQUEST) objError = ErrorOptions.badRequest(logger, request, exception);
		// rome-ignore lint/suspicious/noDoubleEquals: <explanation>
		if (status == HttpStatus.NOT_FOUND) objError = ErrorOptions.notFound(logger, request, exception);
		// rome-ignore lint/suspicious/noDoubleEquals: <explanation>
		if (status == HttpStatus.UNAUTHORIZED) objError = ErrorOptions.unauthorized(logger, request, exception);
		// rome-ignore lint/suspicious/noDoubleEquals: <explanation>
		if (status == HttpStatus.FORBIDDEN) objError = ErrorOptions.forbidden(logger, request, exception);
		// rome-ignore lint/suspicious/noDoubleEquals: <explanation>
		if (status == HttpStatus.CONFLICT) objError = ErrorOptions.conflict(logger, request, exception);
		if (
			![HttpStatus.NO_CONTENT, HttpStatus.BAD_REQUEST, HttpStatus.NOT_FOUND, HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN, HttpStatus.CONFLICT].some(
				// rome-ignore lint/suspicious/noDoubleEquals: <explanation>
				(x) => x == status,
			)
		) {
			objError = ErrorOptions.internalServerError(logger, request, exception);
		}

		response.status(status).json({
			$schema: 'http://json-schema.org/draft-04/schema#',
			description: 'Esquema JSON de respuesta para casos de Error o Falla.',
			type: 'object',
			properties: objError,
		});
	}
}
