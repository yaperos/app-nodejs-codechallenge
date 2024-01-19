import { ServerUnaryCallImpl } from '@grpc/grpc-js/build/src/server-call';
import {
  ArgumentsHost,
  BadRequestException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RpcArgumentsHost } from '@nestjs/common/interfaces';
import { firstValueFrom } from 'rxjs';
import {
  ConflictError,
  InvalidArgumentError,
} from 'src/modules/shared/domain/errors';
import { GrpcExceptionFilter } from 'src/modules/shared/infrastructure/filters/grpc-exception.filter';

import { StringMother } from '../../domain/mothers';
import { ObjectMother } from '../../domain/mothers/object.mother';
import { TestObjectNotFoundError } from '../../domain/test-object-not-found.error';

describe('GrpcExceptionFilter test', () => {
  let mockHost: Partial<ArgumentsHost>;
  let path: string;
  let data: any;

  const grpcExceptionFilter = new GrpcExceptionFilter();
  const loggerErrorSpy = jest
    .spyOn(Logger.prototype, 'error')
    .mockImplementation();

  beforeEach(() => {
    jest.clearAllMocks();

    path = StringMother.random();
    data = ObjectMother.random();
    setGrpcHost(path, data);
  });

  it('should catch HttpException ', async () => {
    const messages = ['http error message'];
    const error = 'test http error';
    const exception = new BadRequestException(messages, error);

    const response = await firstValueFrom(
      grpcExceptionFilter.catch(exception, mockHost as ArgumentsHost),
    );

    expect(response.code).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.error).toEqual(error);
    expect(response.messages).toEqual(messages);

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      ...[exception.message, exception.stack, { path, data }],
    );
  });

  it('should catch HttpException without message', async () => {
    const exception = new BadRequestException(undefined);

    const response = await firstValueFrom(
      grpcExceptionFilter.catch(exception, mockHost as ArgumentsHost),
    );

    expect(response.code).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.error).toEqual(exception.message);
    expect(response.messages).toEqual([exception.message]);

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      ...[exception.message, exception.stack, { path, data }],
    );
  });

  it('should catch ObjectNotFoundError', async () => {
    const exception = new TestObjectNotFoundError();

    const response = await firstValueFrom(
      grpcExceptionFilter.catch(exception, mockHost as ArgumentsHost),
    );

    expect(response.code).toEqual(HttpStatus.NOT_FOUND);
    expect(response.error).toEqual(exception.message);
    expect(response.messages).toEqual([exception.message]);

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      ...[exception.message, exception.stack, { path, data }],
    );
  });

  it('should catch InvalidArgumentError', async () => {
    const message = 'Invalid error';
    const exception = new InvalidArgumentError(message);

    const response = await firstValueFrom(
      grpcExceptionFilter.catch(exception, mockHost as ArgumentsHost),
    );

    expect(response.code).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(response.error).toEqual(message);
    expect(response.messages).toEqual([message]);

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      ...[exception.message, exception.stack, { path, data }],
    );
  });

  it('should catch ConflictError', async () => {
    const message = 'Conflict error';
    const exception = new ConflictError(message);

    const response = await firstValueFrom(
      grpcExceptionFilter.catch(exception, mockHost as ArgumentsHost),
    );

    expect(response.code).toEqual(HttpStatus.CONFLICT);
    expect(response.error).toEqual(message);
    expect(response.messages).toEqual([message]);

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      ...[exception.message, exception.stack, { path, data }],
    );
  });

  it('should catch unknown Error', async () => {
    const message = 'Unknown error';
    const exception = new Error(message);

    const response = await firstValueFrom(
      grpcExceptionFilter.catch(exception, mockHost as ArgumentsHost),
    );

    expect(response.code).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(response.error).toEqual('Internal server error');
    expect(response.messages).toEqual(['Internal server error']);

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      ...[exception.message, exception.stack, { path, data }],
    );
  });

  function setGrpcHost(path: string, data: any) {
    mockHost = {
      switchToRpc: () =>
        ({
          getData: jest.fn().mockReturnValue(data),
          getArgs: () => [
            null,
            null,
            {
              getPath: jest.fn().mockReturnValue(path),
            } as Partial<ServerUnaryCallImpl<any, any>>,
          ],
        } as Partial<RpcArgumentsHost>),
    } as ArgumentsHost;
  }
});
