import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { PrismaService } from './prisma/prisma.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

const mockFindManyTransactions = [
  {
    id: 'f6cf15b6-d871-4cc3-87fb-68132454892a',
    TransactionType: {
      type: 'CREDIT',
    },
    amount: 2000,
    createdAt: '2024-03-20T18:12:52.238Z',
    status: 'PENDING',
  },
  {
    id: 'f6cf15b6-d871-4cc3-87fb-68132454892a',
    TransactionType: {
      type: 'DEBIT',
    },
    amount: 200,
    createdAt: '2024-03-20T18:12:52.238Z',
    status: 'APPROVED',
  },
];

const mockAllTransactions = [
  {
    transactionExternalId: 'f6cf15b6-d871-4cc3-87fb-68132454892a',
    transactionType: {
      name: 'CREDIT',
    },
    value: 2000,
    createdAt: '2024-03-20T18:12:52.238Z',
    transactionStatus: {
      name: 'PENDING',
    },
  },
  {
    transactionExternalId: 'f6cf15b6-d871-4cc3-87fb-68132454892a',
    transactionType: {
      name: 'DEBIT',
    },
    value: 200,
    createdAt: '2024-03-20T18:12:52.238Z',
    transactionStatus: {
      name: 'APPROVED',
    },
  },
];

jest.mock('./prisma/prisma.service', () => {
  return {
    PrismaService: jest.fn().mockImplementation(() => {
      return {
        transaction: {
          findMany: jest.fn().mockResolvedValue(mockFindManyTransactions),
        },
      };
    }),
  };
});

describe('TransactionsController', () => {
  let transactionsController: TransactionsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ClientsModule.register([
          {
            name: 'TRANSACTIONS_TRANSPORT_SERVICE',
            transport: Transport.KAFKA,
            options: {
              client: {
                brokers: ['localhost:9092'],
              },
              consumer: {
                groupId: 'transactions-consumer',
              },
            },
          },
        ]),
      ],
      controllers: [TransactionsController],
      providers: [TransactionsService, PrismaService],
    }).compile();

    transactionsController = app.get<TransactionsController>(
      TransactionsController,
    );
  });

  describe('root', () => {
    it('should return a list of all transactions', async () => {
      const response = await transactionsController.all();
      expect(response).toEqual(mockAllTransactions);
    });
  });
});
