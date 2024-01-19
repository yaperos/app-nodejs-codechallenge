import {
  ArgumentsHost,
  BadRequestException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  GrpcError,
  InvalidArgumentError,
} from 'src/modules/shared/domain/errors';
import { GraphQLExceptionFilter } from 'src/modules/shared/infrastructure/filters/graphql-exception.filter';

import {
  IntegerMother,
  ObjectMother,
  StringMother,
  WordMother,
} from '../domain/mothers';

describe('GraphQLExceptionFilter test', () => {
  let mockHost: Partial<ArgumentsHost>;
  let input: any;

  const graphQLExceptionFilter = new GraphQLExceptionFilter();
  const loggerErrorSpy = jest
    .spyOn(Logger.prototype, 'error')
    .mockImplementation();

  beforeEach(() => {
    jest.clearAllMocks();

    input = {
      type: WordMother.random(),
      path: {
        key: WordMother.random(),
        name: WordMother.random(),
        args: ObjectMother.random(),
      },
      body: undefined,
    };
    setGraphqlHost(input);
  });

  it('should catch HttpException ', async () => {
    const messages = [StringMother.random()];
    const error = StringMother.random();
    const exception = new BadRequestException(messages, error);

    const response = graphQLExceptionFilter.catch(
      exception,
      mockHost as ArgumentsHost,
    );
    expect(response.extensions.code).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.extensions.message).toEqual(messages);
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      ...[exception.message, exception.stack, input],
    );
  });

  it('should catch HttpException without message', async () => {
    const exception = new BadRequestException(undefined);

    const response = graphQLExceptionFilter.catch(
      exception,
      mockHost as ArgumentsHost,
    );

    expect(response.extensions.code).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.extensions.message).toEqual(exception.message);
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      ...[exception.message, exception.stack, input],
    );
  });

  it('should catch GrpcError with messages', async () => {
    const error = StringMother.random();
    const code = IntegerMother.random();
    const messages = [StringMother.random(), StringMother.random()];
    const exception = new GrpcError(error, code, messages);

    const response = graphQLExceptionFilter.catch(
      exception,
      mockHost as ArgumentsHost,
    );

    expect(response.extensions.code).toEqual(code);
    expect(response.extensions.message).toEqual(messages);
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      ...[exception.message, exception.stack, input],
    );
  });

  it('should catch GrpcError with one message', async () => {
    const error = StringMother.random();
    const code = IntegerMother.random();
    const message = StringMother.random();
    const exception = new GrpcError(error, code, [message]);

    const response = graphQLExceptionFilter.catch(
      exception,
      mockHost as ArgumentsHost,
    );

    expect(response.extensions.code).toEqual(code);
    expect(response.extensions.message).toEqual(message);
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      ...[exception.message, exception.stack, input],
    );
  });

  it('should catch InvalidArgumentError', async () => {
    const message = StringMother.random();
    const exception = new InvalidArgumentError(message);

    const response = graphQLExceptionFilter.catch(
      exception,
      mockHost as ArgumentsHost,
    );

    expect(response.extensions.code).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(response.extensions.message).toEqual(message);
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      ...[exception.message, exception.stack, input],
    );
  });

  it('should catch unknown Error', async () => {
    const message = StringMother.random();
    const exception = new Error(message);

    const response = graphQLExceptionFilter.catch(
      exception,
      mockHost as ArgumentsHost,
    );

    expect(response.extensions.code).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(response.extensions.message).toEqual('Internal server error');
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      ...[exception.message, exception.stack, input],
    );
  });

  function setGraphqlHost(input: any) {
    mockHost = {
      getArgs: () => [
        'Arg0',
        input.path.args,
        'Arg3',
        {
          parentType: { name: input.type },
          path: { key: input.path.key },
          fieldName: input.path.name,
          operation: {
            loc: null,
          },
        },
      ],
      getType: () => 'graphql',
    } as ArgumentsHost;
  }
});
