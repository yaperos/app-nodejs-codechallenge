import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { BASE_QUERY } from './queries';
import { CREATE_TRANSACTION } from './mutations/transaction';

const rootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        base: BASE_QUERY
    }
});

const rootMutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createTransaction: CREATE_TRANSACTION
    }
});

export const graphQLSchema = new GraphQLSchema({
    query: rootQuery,
    mutation: rootMutation,
})