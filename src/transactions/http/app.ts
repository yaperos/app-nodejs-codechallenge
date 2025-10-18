import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { transactionsContainer } from "../container";
import { typeDefs } from "../graphql/schema";
import { TransactionGraphQLService } from "../modules/transactions/transaction.graphql.service";

export const buildApp = () => {
  // Creates service instance that implements resolvers
  const service = new TransactionGraphQLService({
    prisma: transactionsContainer.prisma,
    kafka: transactionsContainer.kafka,
    topics: transactionsContainer.topics,
    logger: transactionsContainer.logger.child({ module: "graphql" })
  });

  // Service methods ARE the resolvers
  const resolvers = {
    Query: {
      transaction: service.transaction.bind(service),
      transactions: service.transactions.bind(service)
    },
    Mutation: {
      createTransaction: service.createTransaction.bind(service)
    }
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers
  });

  return server;
};

export const startServer = async (port: number) => {
  const server = buildApp();

  const { url } = await startStandaloneServer(server, {
    listen: { port, host: "0.0.0.0" }
  });

  return { server, url };
};
