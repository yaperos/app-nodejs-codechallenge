import { STATUS } from '@prisma/client';

const MAX_AMOUNT = 1000;
export const transactions = [
  {
    id: '651d7d6f9a7c544dfF43QSD',
    accountExternalIdDebit: '437478HJF784575845787848JHD8',
    accountExternalIdCredit: 'DSHD7674748836748BCXU7823H',
    status: STATUS.PENDING,
    value: 1010,
    tranferTypeId: 1,
    createdAt: '2023-10-04T14:57:51.613Z',
  },
  {
    id: '867867d97896w97s96789s',
    accountExternalIdDebit: '111228HJF784575845787848JHD8',
    accountExternalIdCredit: '34211174748836748BCXU7823H',
    status: STATUS.PENDING,
    value: 1000,
    tranferTypeId: 1,
    createdAt: '2023-10-04T14:57:51.613Z',
  },
  {
    id: '878967d97979ds7967879',
    accountExternalIdDebit: '3456478HJF784575845787848JHD8',
    accountExternalIdCredit: '342674748836748BCXU7823H',
    status: STATUS.APPROVED,
    value: 100,
    tranferTypeId: 1,
    createdAt: '2023-10-04T14:57:51.613Z',
  },
];

export const transactionBody = {
  accountExternalIdDebit: '651d6560cdf715b69c60cc04',
  accountExternalIdCredit: '651d6560cdf715b69c60cc04ss',
  value: 400,
  tranferTypeId: 1,
};

export const transactionResponse = {
  id: '651da5df72906d0c48ce4c17',
  accountExternalIdDebit: '651d6560cdf715b69c60cc04',
  accountExternalIdCredit: '651d6560cdf715b69c60cc04ss',
  status: STATUS.PENDING,
  value: 400,
  tranferTypeId: 1,
  createdAt: '2023-10-04T17:50:23.704Z',
};

export const TransactionModelMock = {
  transactions: jest.fn().mockReturnValue(transactions),
  transaction: (id) =>
    transactions.find((transaction) => transaction.id === id),
  createTransaction: ({ value }) => {
    return value > MAX_AMOUNT
      ? { ...transactionResponse, status: STATUS.REJECTED }
      : transactionResponse;
  },
};
