import { TransactionOutput } from '../models';

export type CreateTransactionUseCaseInput = {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
};

export type CreateTransactionUseCaseOutput = TransactionOutput;
