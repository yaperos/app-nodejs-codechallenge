import { ApiResponseOptions } from '@nestjs/swagger';

export class TransactionSwaggerResponse {
  static readonly create: ApiResponseOptions = {
    status: 201,
    description: 'Create new transaction',
    schema: {
      example: {
        message: 'Transaction created',
        status: 'OK',
        data: {
          transactionExternalId: 'e44b2da0-5272-407d-ba6f-9b571bfb9d9c',
          transactionType: {
            id: 1,
            name: 'type 1',
          },
          transactionStatus: {
            id: 1,
            name: 'pending',
          },
          value: 555,
          createdAt: '2023-03-12T05:46:56.728Z',
        },
      },
    },
  };

  static readonly list: ApiResponseOptions = {
    status: 200,
    description: 'List transactions',
    schema: {
      type: 'array',
      example: {
        message: 'Transactions List',
        data: [
          {
            id: 1,
            createdAt: '2023-03-12T01:21:28.030Z',
            updatedAt: '2023-03-12T01:21:33.301Z',
            accountExternalIdDebit: 'e7991681-16bd-4a57-b112-a96796ba4a21',
            accountExternalIdCredit: 'e7991681-16bd-4a57-b112-a96796ba4a21',
            transactionExternalId: '444363c2-8015-49f4-b84f-7f60de4d9c3c',
            value: 1001,
            transactionType: {
              id: 1,
              name: 'type 1',
            },
            transactionStatus: {
              id: 3,
              name: 'rejected',
            },
          },
        ],
        meta: {
          page: 1,
          take: 10,
          itemCount: 100,
          pageCount: 10,
          hasPreviousPage: true,
          hasNextPage: true,
        },
        status: 'OK',
      },
    },
  };

  static readonly findOne: ApiResponseOptions = {
    status: 200,
    description: 'Transaction Get',
    schema: {
      example: {
        message: 'Transactions List',
        data: {
          id: 1,
          createdAt: '2023-03-12T01:21:28.030Z',
          updatedAt: '2023-03-12T01:21:33.301Z',
          accountExternalIdDebit: 'e7991681-16bd-4a57-b112-a96796ba4a21',
          accountExternalIdCredit: 'e7991681-16bd-4a57-b112-a96796ba4a21',
          transactionExternalId: '444363c2-8015-49f4-b84f-7f60de4d9c3c',
          value: 500,
          transactionType: {
            id: 1,
            name: 'type 1',
          },
          transactionStatus: {
            id: 1,
            name: 'approved',
          },
        },
        status: 'OK',
      },
    },
  };
}
