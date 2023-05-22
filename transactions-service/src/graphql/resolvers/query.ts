import { AppContext } from '../../@types';
import { QueryResolvers } from '../types/types';

export const Query: QueryResolvers<AppContext> = {
  transaction: async (_parent, args, context) => {
    const transaction = await context.transactionController.handleGetTransaction(
      args.transactionExternalId
    );
    return transaction;
  },
};
