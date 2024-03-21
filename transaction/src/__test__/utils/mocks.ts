import { UpdateTransaction } from '../../types';
import { Transaction, TransactionStatus, TransactionType } from '../../models';
import { CreateTransactionInput, GetTransactionInput } from '../../transactions/inputs';

export const inputGet: GetTransactionInput = {
    id: 'e5d0d0c2-76bb-443d-9e5f-e1fffe482d37',
  };
export const input: CreateTransactionInput = {
    accountExternalIdCredit: 'd3b5fef8-dd7f-4d94-a683-4c15fdd4f7c9',
    accountExternalIdDebit: '7b08c71e-8ff8-4e42-8097-494a7bea353d',
    transactionTypeId: 1,
    value: 200
};

export const payload: UpdateTransaction = {
    id: 'e5d0d0c2-76bb-443d-9e5f-e1fffe482d37',
    code: 200,
};


export const transactionType: TransactionType = {
    id: 1,
    isActive: true,
    name: 'Deposito',
    transactions: []
}
export const transactionStatus: TransactionStatus = {
    id: '1fe25055-de88-482a-be2d-c16fbf2d9df3',
    code: 200,
    isActive: true,
    name: 'approved',
    transactions: []
}

export const createdTransaction: Transaction = {
    transactionExternalId: 'e5d0d0c2-76bb-443d-9e5f-e1fffe482d37',
    accountExternalIdCredit: 'd3b5fef8-dd7f-4d94-a683-4c15fdd4f7c9',
    accountExternalIdDebit: '7b08c71e-8ff8-4e42-8097-494a7bea353d',
    transactionStatus,
    transactionType,
    value: 200,
    createdAt: new Date(),
    updatedAt: new Date(),
};
export const transaction = createdTransaction;
export const transactions = [createdTransaction];