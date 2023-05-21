import { AppContext } from '../../@types';
import { MutationResolvers } from '../types/types';

export const Mutation: MutationResolvers<AppContext> = {
  createTransaction: async (_parent, args, context) => {
    const transaction = await context.transactionService.create(args.data);
    return transaction;
  },
};
