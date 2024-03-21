import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../prisma/prisma.service';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionStatus } from '@prisma/client';
import { CreateTransactionDto } from './dto/create-transaction.dto';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let prismaService: PrismaService;
  let kafkaClient: ClientKafka;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        PrismaService,
        {
          provide: 'TRANSACTION_MICROSERVICE',
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    prismaService = module.get<PrismaService>(PrismaService);
    kafkaClient = module.get<ClientKafka>('TRANSACTION_MICROSERVICE');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create transaction and emit event', async () => {
      const createTransactionDto: CreateTransactionDto = {
        accountExternalIdDebit: '123456',
        accountExternalIdCredit: '789012',
        tranferTypeId: 1,
        value: 100,
      };

      const mockedTransaction = {
        id: 1,
        status: TransactionStatus.PENDING,
        ...createTransactionDto,
      };

      jest
        .spyOn(prismaService.transaction, 'create')
        .mockResolvedValueOnce(mockedTransaction);

      await expect(service.create(createTransactionDto)).resolves.toEqual(
        mockedTransaction,
      );

      expect(kafkaClient.emit).toHaveBeenCalledWith(
        'create_transaction',
        JSON.stringify(mockedTransaction),
      );
    });
  });

  describe('findAll', () => {
    it('should return all transactions', async () => {
      const mockedTransactions = [
        {
          id: 1,
          accountExternalIdDebit: '123456',
          accountExternalIdCredit: '789012',
          tranferTypeId: 1,
          value: 100,
          status: TransactionStatus.APPROVED,
        },
        {
          id: 2,
          accountExternalIdDebit: '111111',
          accountExternalIdCredit: '222222',
          tranferTypeId: 1,
          value: 100,
          status: TransactionStatus.REJECTED,
        },
      ];

      jest
        .spyOn(prismaService.transaction, 'findMany')
        .mockResolvedValueOnce(mockedTransactions);

      await expect(service.findAll()).resolves.toEqual(mockedTransactions);
    });
  });
});
