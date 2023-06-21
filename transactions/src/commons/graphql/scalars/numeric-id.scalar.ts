import { GraphQLScalarType } from 'graphql';

const NumericID = new GraphQLScalarType({
  name: 'NumericID',
  description: 'Numeric ID scalar type',
  serialize(value: number): string {
    return String(value);
  },
  parseValue(value: string): number {
    return parseInt(value, 10);
  },
});

export default NumericID;
