import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { DataSource, DataSourceOptions } from 'typeorm';
import { transactionResolvers } from './resolvers/transaction.resolver.js';
import { initConsumer } from './kafka/consumer.js';
import { typeDefs } from './schema/transaction.schema.js';
import { Transaction } from './models/transaction.model.js';

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  synchronize: true,
  logging: false,
  entities: [Transaction],
};

export const dataSource = new DataSource(dataSourceOptions);
await dataSource.initialize();

await initConsumer(dataSource);

const server = new ApolloServer({
  typeDefs,
  resolvers: transactionResolvers,
  context: ({ req }) => ({
    dataSource,
    request: req,
  }),
} as any);

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
