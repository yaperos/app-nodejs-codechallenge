import { Test, TestingModule } from '@nestjs/testing';
import { CreateTransactionRequest } from 'src/application/dto/create-transaction.request';
import { TransactionService } from '../../src/application/transaction.service';
import { PrismaInfrastructure } from '../../src/infrastructure/database/prisma.infrastructure';
import { ConsumerInfrastructure } from '../../src/infrastructure/stream/consumer.infrastructure';
import { ProducerInfrastructure } from '../../src/infrastructure/stream/producer.infrastructure';
import { transactionStatus } from '../../src/shared/constants';
import { UpdateTransactionRequest } from 'src/application/dto/update-transaction.request';

describe('TransactionService', () => {
  let transactionService: TransactionService;
  let producerInfrastructure: ProducerInfrastructure;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: 'IProducer',
          useClass: ProducerInfrastructure,
        },
        {
          provide: 'IConsumer',
          useClass: ConsumerInfrastructure,
        },
        {
          provide: PrismaInfrastructure,
          useValue: {
            transaction: {
              findUnique: jest.fn().mockResolvedValueOnce({
                data: JSON.stringify({
                  accountExternalIdCredit: '1',
                  accountExternalIdDebit: '2',
                  value: 500,
                  transactionStatus: { name: transactionStatus.approved },
                }),
              }),
              create: jest.fn().mockResolvedValueOnce({
                data: JSON.stringify({
                  accountExternalIdCredit: '1',
                  accountExternalIdDebit: '2',
                  value: 500,
                  transactionStatus: { name: transactionStatus.approved },
                }),
              }),
              update: jest.fn().mockResolvedValueOnce({
                data: JSON.stringify({
                  transactionExternalId: '1',
                  transactionType: {
                    name: '0',
                  },
                  transactionStatus: {
                    name: '0',
                  },
                  value: 500,
                  createdAt: new Date(),
                }),
              }),
            },
          },
        },
      ],
    }).compile();

    transactionService = module.get<TransactionService>(TransactionService);
    producerInfrastructure = module.get<ProducerInfrastructure>('IProducer');
  });

  it('should be defined', () => {
    expect(transactionService).toBeDefined();
  });

  it('should get transaction', async () => {
    const transaction = await transactionService.getTransaction('1', '2');
    expect(transaction.value).toBe(500);
    expect(transaction.transactionStatus.name).toBe(transactionStatus.approved);
  });

  it('should create transaction', async () => {
    const transactionData: CreateTransactionRequest = {
      accountExternalIdCredit: '1',
      accountExternalIdDebit: '2',
      value: 500,
      tranferTypeId: 0,
    };
    producerInfrastructure.produce = jest.fn().mockResolvedValueOnce(null);
    const transaction =
      await transactionService.createTransaction(transactionData);
    expect(transaction.value).toBe(500);
    expect(transaction.transactionStatus.name).toBe(transactionStatus.approved);
  });

  it('should update transaction', async () => {
    const transactionData: UpdateTransactionRequest = {
      accountExternalIdCredit: '1',
      accountExternalIdDebit: '2',
      value: 500,
      transactionExternalId: '1',
      transactionType: {
        name: '0',
      },
      transactionStatus: {
        name: '0',
      },
      createdAt: new Date(),
    };
    await transactionService.updateTransaction(transactionData);
  });
});
