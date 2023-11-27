import { GraphQLFormattedError } from 'graphql';

export const graphqlFormatError = (error: GraphQLFormattedError) => {
  const originalError = error.extensions?.originalError as any;

  return {
    message: originalError?.message ?? error.message,
    code: error.extensions?.code,
  };
};
