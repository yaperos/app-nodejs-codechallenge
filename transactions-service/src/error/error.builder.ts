import { GraphQLError } from 'graphql';

export class ErrorBuilder {
  static notFoundError = (message: string):GraphQLError => new GraphQLError(message, { extensions: { code: 'NOT_FOUND' } });

  static internalError = (message: string):GraphQLError => new GraphQLError(message, { extensions: { code: 'INTERNAL_SERVER_ERROR' } });

  static badRequestError = (message: string):GraphQLError => new GraphQLError(message, { extensions: { code: 'BAD_REQUEST' } });
}
