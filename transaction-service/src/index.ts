import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './infrastructure/graphql/schemas/transaction';
import { resolvers } from './infrastructure/graphql/resolvers/resolvers';
import {AppDataSource} from "./infrastructure/database/datasource";

const app = express();
const port = 3000;

const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
    await server.start();

    server.applyMiddleware({ app });

    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
        console.log(`GraphQL endpoint: http://localhost:${port}${server.graphqlPath}`);
    });
}

AppDataSource.initialize()
    .then(() => {
        console.log('Conexión a BD establecida correctamente')
    })
    .catch((error) => console.log(error))

startServer().catch((error) => {
    console.error('Error starting the server:', error);
});