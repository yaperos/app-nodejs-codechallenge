import { GraphQLError } from 'graphql';

/**
 * Class used to build different GraphQL errors
 */
class ErrorBuilder {
  /**
   * Creates a Not Found Error
   * @param {string} message Message to include on the error
   * @returns {GraphQLError} A Not Found GraphQL error
   */
  static notFoundError = (message: string): GraphQLError => new GraphQLError(message, { extensions: { code: 'NOT_FOUND' } });

  /**
   * Creates an Internal Server Error
   * @param {string} message Message to include on the error
   * @returns {GraphQLError} A Internal Server Error GraphQL error
   */
  static internalError = (message: string): GraphQLError => new GraphQLError(message, { extensions: { code: 'INTERNAL_SERVER_ERROR' } });

  /**
   * Creates a Bad Request Error
   * @param {string} message Message to include on the error
   * @returns {GraphQLError} A Bad Request GraphQL error
   */
  static badRequestError = (message: string): GraphQLError => new GraphQLError(message, { extensions: { code: 'BAD_REQUEST' } });
}

export { ErrorBuilder };
