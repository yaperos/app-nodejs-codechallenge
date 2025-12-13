import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import { AppDataSource } from './config/data-source';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './graphql/transaction.schema';
import { resolvers } from './graphql/transaction.resolver';
import { startConsumer } from './kafka/client/consumer';
import { TransactionService } from './services/TransactionService';
const app = express();
app.use(bodyParser.json());


// GraphQL endpoint
async function startApolloServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });
}



// Inicializa la conexión con la base de datos antes de exponer los endpoints
AppDataSource.initialize()
  .then(async () => {
    await startApolloServer();
    const PORT = process.env.PORT || 3002;
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
      console.log(`GraphQL listo en http://localhost:${PORT}/graphql`);
    });


    // Iniciar el consumer de Kafka para actualizar el estado de la transacción
    const transactionEventService = new (require('./services/TransactionEventService').TransactionEventService)();
    await startConsumer(async (event) => {
      await transactionEventService.consumeTransactionEvent(event);
      console.log(`Estado de transacción actualizado: ${event.transactionExternalId} -> ${event.status}`);
    });
  })
  .catch((error) => {
    console.error('Error al inicializar la base de datos:', error);
  });
