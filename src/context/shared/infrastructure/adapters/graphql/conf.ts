import { ApolloServer } from 'apollo-server-express';
import { transactionResolver } from './resolvers/TransactionResolver';
import { typeDefs } from './schemas/TransactionType';
import container from '@app/dependency-injection';
import CreateTransactionController from '@app/controllers/transactions/create/CreateTransactionController';
import GetTransactionByIdController from '@app/controllers/transactions/find/GetTransactionByIdController';

const createTransactionController: CreateTransactionController = container.get('Controller.Transaction.Create');
const getTransactionByIdController: GetTransactionByIdController = container.get('Controller.Transaction.Get');

const resolvers = [
  transactionResolver,
];

const context = {
  createTransactionController,
  getTransactionByIdController,
}

const graphqlServer = new ApolloServer({ typeDefs, resolvers, context });

export default graphqlServer;
