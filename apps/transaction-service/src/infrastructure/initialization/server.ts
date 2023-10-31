import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { PORT } from '../environment';
import { serviceResolvers } from '../graphql/resolvers';
import { typeDefs } from '../graphql/typeDefs';

const server = new ApolloServer({
  resolvers: serviceResolvers,
  typeDefs,
});

export const initServer = async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: PORT },
  });

  console.log(`🚀  Server ready at: ${url}`);
};
