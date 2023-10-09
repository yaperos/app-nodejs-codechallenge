import { GraphQLString } from "graphql";

export const BASE_QUERY = {
    type: GraphQLString,
    resolve() {
        return "GraphQL is available"
    }
}