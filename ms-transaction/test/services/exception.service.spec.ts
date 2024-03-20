//ExeptionService test
import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ExceptionsService } from '../../src/infrastructure/services/exceptions/exceptions.service';

describe('ExceptionService', () => {
  let service: ExceptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExceptionsService],
    }).compile();

    service = module.get<ExceptionsService>(ExceptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw a HttpException', async () => {
    try {
      service.badRequestException({
        message: 'Bad request',
        code_error: HttpStatus.BAD_REQUEST,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }
  });

  it('should throw a HttpException', async () => {
    try {
      service.notFoundException({
        message: 'Not found',
        code_error: HttpStatus.NOT_FOUND,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }
  });

  it('should throw a HttpException', async () => {
    try {
      service.internalServerErrorException({
        message: 'Internal server error',
        code_error: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }
  });

  it('should throw a HttpException', async () => {
    try {
      service.forbiddenException({
        message: 'Forbidden',
        code_error: HttpStatus.FORBIDDEN,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }
  });

  it('should throw a HttpException', async () => {
    try {
      service.UnauthorizedException({
        message: 'Unauthorized',
        code_error: HttpStatus.UNAUTHORIZED,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }
  });

  it('should throw a HttpException', async () => {
    try {
      service.badGatewayException({
        message: 'Bad gateway',
        code_error: HttpStatus.BAD_GATEWAY,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }
  });

  it('should throw a HttpException', async () => {
    try {
      service.methodNotAllowedException({
        message: 'Method not allowed',
        code_error: HttpStatus.METHOD_NOT_ALLOWED,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }
  });

  it('should throw a HttpException', async () => {
    try {
      service.conflictException({
        message: 'Conflict',
        code_error: HttpStatus.CONFLICT,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }
  });
});
