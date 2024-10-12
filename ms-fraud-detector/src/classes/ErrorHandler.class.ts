import { BadRequestException, ForbiddenException, HttpStatus, InternalServerErrorException, NotFoundException } from "@nestjs/common";

interface IErrorStructure {
	statusCode: HttpStatus;
	error: string;
	message: string;
}

export class ErrorHandler {

	/**
	 * Throw NOT FOUND (400 Http exception)
	 * @param message 
	 */
	public static throwBadRequestException(message: string): IErrorStructure {
		throw new BadRequestException({
			statusCode: HttpStatus.BAD_REQUEST,
			error: "Bad Request",
			message
		});
	}
	
	/**
	 * Throw NOT FOUND (403 Http exception)
	 * @param message 
	 */
	public static throwForbiddenException(message: string): IErrorStructure {
		throw new ForbiddenException({
			statusCode: HttpStatus.FORBIDDEN,
			error: "Forbidden Operation",
			message
		});
	}
	
	/**
	 * Throw NOT FOUND (404 Http exception)
	 * @param message 
	 */
	public static throwNotFoundException(message: string): IErrorStructure {
		throw new NotFoundException({
			statusCode: HttpStatus.NOT_FOUND,
			error: "Not Found",
			message
		});
	}

	/**
	 * Throw NOT FOUND (500 Http exception)
	 * @param message 
	 */
	public static throwInternalServerErrorException(message: string): IErrorStructure {
		throw new InternalServerErrorException({
			statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
			error: "Internal Server Error",
			message
		});
	}
}