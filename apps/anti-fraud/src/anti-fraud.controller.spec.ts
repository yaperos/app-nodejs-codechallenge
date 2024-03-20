import { Test, TestingModule } from '@nestjs/testing';
import { AntiFraudController } from './anti-fraud.controller';
import { AntiFraudService } from './anti-fraud.service';
import { PrismaService } from './prisma/prisma.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

const mockFindManyTransactions = [
  {
    id: 'f6cf15b6-d871-4cc3-87fb-68132454892a',
    transaction_id: 'f6cf15b6-d871-4cc3-87fb-68132454892a',
    createdAt: '2024-03-20T18:12:52.238Z',
    updateAt: '2024-03-20T18:12:52.238Z',
    status: 'PENDING',
  },
  {
    id: 'f6cf15b6-d871-4cc3-87fb-68132454892a',
    transaction_id: 'f6cf15b6-d871-4cc3-87fb-68132454892a',
    createdAt: '2024-03-20T18:12:52.238Z',
    updateAt: '2024-03-20T18:12:52.238Z',
    status: 'APPROVED',
  },
];

jest.mock('./prisma/prisma.service', () => {
  return {
    PrismaService: jest.fn().mockImplementation(() => {
      return {
        antiFraud: {
          findMany: jest.fn().mockResolvedValue(mockFindManyTransactions),
        },
      };
    }),
  };
});

describe('AntiFraudController', () => {
  let antiFraudController: AntiFraudController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ClientsModule.register([
          {
            name: 'ANTI_FRAUD_TRANSPORT_SERVICE',
            transport: Transport.KAFKA,
            options: {
              client: {
                brokers: ['localhost:9092'],
              },
              consumer: {
                groupId: 'anti-fraud-consumer',
              },
            },
          },
        ]),
      ],
      controllers: [AntiFraudController],
      providers: [AntiFraudService, PrismaService],
    }).compile();

    antiFraudController = app.get<AntiFraudController>(AntiFraudController);
  });

  describe('root', () => {
    it('should return a list of all anti-frauds', async () => {
      expect(await antiFraudController.all()).toEqual(mockFindManyTransactions);
    });
  });
});
