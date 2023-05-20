import { AppContext } from '../../@types/types';
import { QueryResolvers } from '../types/types';

export const Query: QueryResolvers<AppContext> = {
  transaction: async (_parent, args, context) => {
    const transaction = await context.transactionService.get(args.transactionExternalId);
    return transaction;
  },
};
