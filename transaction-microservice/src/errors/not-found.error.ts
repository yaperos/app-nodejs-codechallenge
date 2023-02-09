import { GraphQLError, GraphQLErrorExtensions } from 'graphql';
import { Maybe } from 'graphql/jsutils/Maybe';

export class NotFoundError extends GraphQLError {
  constructor(message: string, extensions?: Maybe<GraphQLErrorExtensions>) {
    super(message, {
      extensions: {
        code: 'NOT_FOUND',
        ...extensions,
      },
    });
  }
}
