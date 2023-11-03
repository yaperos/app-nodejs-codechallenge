import {
  BadRequestException,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { HttpStatus } from '@nestjs/common';
import { HttpExceptionFilter } from './http.exception.filter';
import { ArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';

describe('HttpExceptionFilter', () => {
  let httpExceptionFilter: HttpExceptionFilter;
  let host: ArgumentsHost;
  let response: Response;
  let request: Request;

  beforeEach(() => {
    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    request = {} as Request;

    const mockSwitchToHttp = {
      getResponse: jest.fn(() => response),
      getRequest: jest.fn(() => request),
    };

    host = {
      switchToHttp: jest.fn(() => mockSwitchToHttp),
    } as unknown as ArgumentsHost;

    httpExceptionFilter = new HttpExceptionFilter();
  });

  it('should be defined', () => {
    expect(httpExceptionFilter).toBeDefined();
  });

  it('should catch HttpException and handle it', () => {
    const exception = new HttpException(
      'Test exception message',
      HttpStatus.BAD_REQUEST,
    );
    httpExceptionFilter.catch(exception, host);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(response.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Test exception message',
      code: 'HttpException',
      url: 'undefined undefined',
    });
  });

  it('should catch UnauthorizedException and handle it', () => {
    const exception = new UnauthorizedException('Unauthorized');
    httpExceptionFilter.catch(exception, host);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(response.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Unauthorized',
      code: 'HttpException',
      url: 'undefined undefined',
    });
  });

  it('should catch BadRequestException and handle it', () => {
    const exception = new BadRequestException('Bad request');
    httpExceptionFilter.catch(exception, host);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(response.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Bad request',
      code: 'HttpException',
      url: 'undefined undefined',
    });
  });

  it('should handle generic exceptions with default status code', () => {
    const genericException = new Error('Generic error');
    httpExceptionFilter.catch(genericException, host);

    expect(response.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(response.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Generic error',
      code: 'HttpException',
      url: 'undefined undefined',
    });
  });
});
