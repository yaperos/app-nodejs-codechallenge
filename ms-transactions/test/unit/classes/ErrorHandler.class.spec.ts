import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  InternalServerErrorException,
  HttpStatus,
} from '@nestjs/common';
import { ErrorHandler } from '../../../src/classes/ErrorHandler.class';

describe('ErrorHandler', () => {
  
  it('should throw BadRequestException with correct structure', () => {
    const message = 'Invalid request';
    
    expect(() => ErrorHandler.throwBadRequestException(message)).toThrow(BadRequestException);
    
    try {
      ErrorHandler.throwBadRequestException(message);
    } catch (error) {
      expect(error.response).toEqual({
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: message,
      });
    }
  });

  it('should throw ForbiddenException with correct structure', () => {
    const message = 'Access denied';

    expect(
			() => ErrorHandler.throwForbiddenException(message)
		).toThrow(ForbiddenException);
    
    try {
      ErrorHandler.throwForbiddenException(message);
    } catch (error) {
      expect(error.response).toEqual({
        statusCode: HttpStatus.FORBIDDEN,
        error: 'Forbidden Operation',
        message: message,
      });
    }
  });

  it('should throw NotFoundException with correct structure', () => {
    const message = 'Resource not found';

    expect(
			() => ErrorHandler.throwNotFoundException(message)
		).toThrow(NotFoundException);
    
    try {
      ErrorHandler.throwNotFoundException(message);
    } catch (error) {
      expect(error.response).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: message,
      });
    }
  });

  it('should throw InternalServerErrorException with correct structure', () => {
    const message = 'An unexpected error occurred';

    expect(
			() => ErrorHandler.throwInternalServerErrorException(message)
		).toThrow(InternalServerErrorException);
    
    try {
      ErrorHandler.throwInternalServerErrorException(message);
    } catch (error) {
      expect(error.response).toEqual({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: message,
      });
    }
  });
});
