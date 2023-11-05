import { GraphQLScalarType } from 'graphql';

export const dateScalar = new GraphQLScalarType({
  name: 'Date',
  parseValue(value: string | number) {
    return new Date(value);
  },
  serialize(value: Date) {
    return value.toISOString();
  },
});
