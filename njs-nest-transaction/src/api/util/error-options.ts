import { HttpException, HttpStatus } from '@nestjs/common';
import { Logger } from 'winston';

import { ErrorResponse, InvalidParametersErrorResponse } from '../response';
import { LogsOptions } from '../util';

export class ErrorOptions {
	public static noContent(_logger: Logger, _req: Request, _exception: HttpException): ErrorResponse {
		const objError = new ErrorResponse();
		objError.title = 'No Content';
		objError.detail = _exception.message || 'No Content Exception';
		objError.type = getUrlSwaggerEnv();
		objError.status = HttpStatus.NO_CONTENT;
		objError.codigoDeError = HttpStatus.NO_CONTENT;

		LogsOptions.error(_logger, objError.status, objError.detail, objError);
		return objError;
	}

	public static badRequest(_logger: Logger, _req: Request, _exception: HttpException): ErrorResponse {
		const objError = new ErrorResponse();

		objError.title = 'Bad Request';
		// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		objError.detail = (_exception as any).detail ?? (_exception.message || 'Bad Request Exception');
		objError.type = getUrlSwaggerEnv();
		objError.status = HttpStatus.BAD_REQUEST;
		objError.codigoDeError = HttpStatus.BAD_REQUEST;

		const invalidParamsList = Array<InvalidParametersErrorResponse>();

		const exceptionIsArray = Array.isArray(
			typeof _exception.getResponse() === 'string'
				? JSON.parse(_exception.getResponse() as string)
				// rome-ignore lint/suspicious/noExplicitAny: <explanation>
:  (_exception.getResponse() as { message: any }).message,
		);

		// rome-ignore lint/suspicious/noExplicitAny: <explanation>
const  messages = (_exception.getResponse() as { message: any }).message;
		if (exceptionIsArray && messages.length > 0) {
			// rome-ignore lint/nursery/noForEach: <explanation>
// rome-ignore lint/suspicious/noExplicitAny: <explanation>
messages.forEach((key: any) => {
				const lastValidCaracter: number = key.indexOf('{');
				const result: string = key.substring(lastValidCaracter);

				const objStr = isJson(result) ? JSON.parse(result) : { name: 'undefined', reason: result };
				const invalidParams: InvalidParametersErrorResponse = {
					name: objStr.name,
					reason: objStr.reason,
				};
				if (!invalidParamsList.some((x) => x.name === invalidParams.name)) {
					invalidParamsList.push(invalidParams);
				}
			});
		}

		if (objError['invalid-params']) objError.detail = 'Bad Request Exception';

		LogsOptions.error(_logger, objError.status, objError.detail, objError);
		
		return objError;
	}

	public static notFound(_logger: Logger, _req: Request, _exception: HttpException): ErrorResponse {
		const objError = new ErrorResponse();
		objError.title = 'Not Found';
		objError.detail = _exception.message || 'Not Found Exception';
		objError.type = getUrlSwaggerEnv();
		objError.status = HttpStatus.NOT_FOUND;
		objError.codigoDeError = HttpStatus.NOT_FOUND;

		LogsOptions.error(_logger, objError.status, objError.detail, objError);

		return objError;
	}

	// unauthorized
	public static unauthorized(_logger: Logger, _req: Request, _exception: HttpException): ErrorResponse {
		const objError = new ErrorResponse();
		objError.title = 'Unauthorized';
		objError.detail = _exception.message || 'Unauthorized Exception';
		objError.type = getUrlSwaggerEnv();
		objError.status = HttpStatus.UNAUTHORIZED;
		objError.codigoDeError = HttpStatus.UNAUTHORIZED;

		LogsOptions.error(_logger, objError.status, objError.detail, objError);

		return objError;
	}

	// forbidden
	public static forbidden(_logger: Logger, _req: Request, _exception: HttpException): ErrorResponse {
		const objError = new ErrorResponse();
		objError.title = 'Forbidden';
		objError.detail = _exception.message || 'Forbidden Exception';
		objError.type = getUrlSwaggerEnv();
		objError.status = HttpStatus.FORBIDDEN;
		objError.codigoDeError = HttpStatus.FORBIDDEN;

		LogsOptions.error(_logger, objError.status, objError.detail, objError);

		return objError;
	}

	// conflict
	public static conflict(_logger: Logger, _req: Request, _exception: HttpException): ErrorResponse {
		const objError = new ErrorResponse();
		objError.title = 'Conflict';
		objError.detail = _exception.message || 'Conflict Exception';
		objError.type = getUrlSwaggerEnv();
		objError.status = HttpStatus.CONFLICT;
		objError.codigoDeError = HttpStatus.CONFLICT;

		LogsOptions.error(_logger, objError.status, objError.detail, objError);

		return objError;
	}

	public static internalServerError(_logger: Logger, _req: Request, _exception: HttpException): ErrorResponse {
		const objError = new ErrorResponse();
		objError.title = 'Internal Server Error';
		objError.detail = _exception.message || 'Internal Server Error Exception';
		objError.type = getUrlSwaggerEnv();
		objError.status = HttpStatus.INTERNAL_SERVER_ERROR;
		objError.codigoDeError = HttpStatus.INTERNAL_SERVER_ERROR;

		LogsOptions.error(_logger, objError.status, objError.detail, objError);

		return objError;
	}
}

function getUrlSwaggerEnv(): string {
	return process.env.ERROR_FILTER_TYPE || '';
}

function isJson(str: string) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}

class CustomHeaders {
	private headers: { name: string; value: string }[] = [];

	constructor() {
		this.headers = [];
	}

	add(key: string, value: string): void {
		this.headers = [...this.headers, { name: key, value }];
	}

	get(key: string): string {
		const header = this.headers.find((h) => h.name === key);
		return header ? header.value : '';
	}

	has(key: string): boolean {
		return this.headers.some((h) => h.name === key);
	}
}
