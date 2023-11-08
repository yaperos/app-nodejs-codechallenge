import { AxiosResponse } from 'axios';
import { faker } from '@faker-js/faker';

export const mockGetTransaction = {
  accountExternalIdDebit: 'b5825a95-1272-4d05-b66d-6142e0bfcdc9',
  accountExternalIdCredit: '007cbe10-ebe4-4d68-ad97-c3870106285b',
  tranferTypeId: 1,
  value: 100,
  id: '7a5cdb08-759d-4a0e-aba8-703ebb18a24a',
  status: 'approved',
  createdAt: '2023-11-08T02:55:25.272Z',
  updatedAt: '2023-11-08T02:55:25.272Z',
};

export const mockReturnGetTransaction = {
  transactionExternalId: mockGetTransaction.id,
  transactionType: {
    name: 'deposit',
  },
  transactionStatus: {
    name: 'approved',
  },
  value: mockGetTransaction.value,
  createdAt: new Date(mockGetTransaction.createdAt),
};

export const mockCreateTransaction = {
  ...mockGetTransaction,
  status: 'pending',
};

export const mockReturnCreateTransaction = {
  ...mockReturnGetTransaction,
  transactionStatus: {
    name: 'pending',
  },
};

export const mockParamasCreateTransaction = {
  accountExternalIdDebit: mockGetTransaction.accountExternalIdDebit,
  accountExternalIdCredit: mockGetTransaction.accountExternalIdCredit,
  tranferTypeId: mockGetTransaction.tranferTypeId,
  value: mockGetTransaction.value,
};

export const axiosResponseMock = (responseMock: unknown): AxiosResponse => {
  return {
    data: responseMock,
    status: 200,
    statusText: faker.lorem.word(),
    headers: {},
    config: undefined,
  };
};
