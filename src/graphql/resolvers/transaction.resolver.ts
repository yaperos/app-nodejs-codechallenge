import {createTransaction, getTransaction, getTransactions,updateTransaction} from "../services/transaction.service";

export const transactionsResolver = {
  Query: {
    async transactions(_: any, args: Record<string, any>, context: any) {
      return getTransactions();
    },
    async transaction(_: any, args: Record<string, any>, context: any) {
      return getTransaction({id: args.id});
    },
  },
  Mutation: {
    async createdTransaction(_: any, {input}: Record<string, any>) {
      return createTransaction({accountExternalIdDebit: input.accountExternalIdDebit,
                                  accountExternalIdCredit: input.accountExternalIdCredit,
                                  tranferTypeId:input.tranferTypeId,
                                  value:input.value,
                                  id:input.id
                                  });
    },
    async updatedTransaction(_: any, {input}: Record<string, any>) {
      return updateTransaction({id: input.id,
                                  status: input.status,
                                  });
    },
  },
};
