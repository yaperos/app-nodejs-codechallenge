import {readFileSync} from "fs";
import path from "path";
import {transactionsResolver} from "./resolvers/transaction.resolver";

const transactionTypes = readFileSync(path.join(__dirname, "./typeDefs/transaction.graphql"), {
  encoding: "utf-8",
});


export const typeDefs = `
    ${transactionTypes}
`;

export const resolvers = {
  Query: {
    ...transactionsResolver.Query,
  },
  Mutation: {
    ...transactionsResolver.Mutation,
  },
};
