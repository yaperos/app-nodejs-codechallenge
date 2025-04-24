import { GraphQLExceptionFilter } from '../../src/modules/transaction/infrastructure/graphql/filters/graphql-exception.filter';
import { ArgumentsHost, HttpException } from '@nestjs/common';
import { GraphQLError } from 'graphql';

describe('GraphQLExceptionFilter', () => {
  it('should return GraphQLError with correct extensions', () => {
    const exception = new HttpException({ message: 'Not found', error: 'Not Found' }, 404);
    const mockHost = {
      getType: jest.fn().mockReturnValue('graphql'),
      switchToHttp: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getArgs: jest.fn().mockReturnValue([]),
    } as unknown as ArgumentsHost;

    const filter = new GraphQLExceptionFilter();
    const error = filter.catch(exception, mockHost);

    expect(error).toBeInstanceOf(GraphQLError);
    expect(error.extensions.code).toBe(404);
    expect(error.extensions.message).toBe('Not found');
  });
});