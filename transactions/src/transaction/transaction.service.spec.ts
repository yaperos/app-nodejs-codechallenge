import {
  Test,
  TestingModule,
} from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { PrismaService } from '../prisma/prisma.service';
import { KafkaProducerService } from '../core/kafka/kafka-producer.service';
import { EmitTransactionDto } from './dto/emit-transaction.dto';
import { Decimal } from '@prisma/client/runtime/library';

describe('TransactionService', () => {
  let service: TransactionService;
  let prismaService: PrismaService;
  let kafkaProducerService: KafkaProducerService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          TransactionService,
          {
            provide: PrismaService,
            useValue: {
              transaction: {
                findMany: jest.fn(),
                findFirst: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
              },
              transactionStatus: {
                create: jest.fn(),
                deleteMany: jest.fn(),
                findFirst: jest.fn(),
              },
              $transaction: jest.fn(),
            },
          },
          {
            provide: KafkaProducerService,
            useValue: {
              emit: jest.fn(),
            },
          },
        ],
      }).compile();

    service = module.get<TransactionService>(
      TransactionService,
    );
    prismaService = module.get<PrismaService>(
      PrismaService,
    );
    kafkaProducerService =
      module.get<KafkaProducerService>(
        KafkaProducerService,
      );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of transactions', async () => {
      const expectedTransactions = [
        {
          transactionId:
            '0fe05c39-ee80-4c20-af90-ac871d530f44',
          amount: '120',
          account_id_debit:
            'clrwgjzn50002e3q7tqayp7jr',
          account_id_credit:
            'clrwgmyud0002r9q75h2u8p7h',
          external_account_id_debit: null,
          external_account_id_credit: null,
          createdAt: '2024-01-29T04:20:49.404Z',
          deletedAt: null,
          snapshotId: null,
          transactionTypeId: null,
        },
        {
          transactionId:
            '1364ecb2-0b90-4850-b4ec-b0ab9b362a6e',
          amount: '120',
          account_id_debit:
            'clrwgjzn50002e3q7tqayp7jr',
          account_id_credit:
            'clrwgmyud0002r9q75h2u8p7h',
          external_account_id_debit: null,
          external_account_id_credit: null,
          createdAt: '2024-01-28T22:51:59.459Z',
          deletedAt: null,
          snapshotId: null,
          transactionTypeId: null,
        },
      ];
      (
        prismaService.transaction
          .findMany as jest.Mock
      ).mockResolvedValue(expectedTransactions);
      expect(await service.getAll()).toEqual(
        expectedTransactions,
      );
    });
  });
  describe('getTransactionById', () => {
    it('should return a transaction by id', async () => {
      const transactionId = 'some-transaction-id';
      const mockTransaction = {
        transactionId:
          '0fe05c39-ee80-4c20-af90-ac871d530f44',
        amount: '120',
        account_id_debit:
          'clrwgjzn50002e3q7tqayp7jr',
        account_id_credit:
          'clrwgmyud0002r9q75h2u8p7h',
        external_account_id_debit: null,
        external_account_id_credit: null,
        createdAt: '2024-01-29T04:20:49.404Z',
        deletedAt: null,
        snapshotId: null,
        transactionTypeId: null,
      };
      const mockTransactionStatus = {
        TransactionStatusId:
          'd3662d6f-f4ad-491f-82bd-02ad0179147c',
        from: '2024-01-29T04:20:49.404Z',
        To: null,
        transactionId:
          '0fe05c39-ee80-4c20-af90-ac871d530f44',
        statusTransactionId: 'PENDING',
      };

      (
        prismaService.transaction
          .findFirst as jest.Mock
      ).mockResolvedValue(mockTransaction);
      (
        prismaService.transactionStatus
          .findFirst as jest.Mock
      ).mockResolvedValue(mockTransactionStatus);

      const result =
        await service.getTransactionById(
          transactionId,
        );
      expect(result).toEqual({
        transaction: mockTransaction,
        status: mockTransactionStatus,
      });
      expect(
        prismaService.transaction.findFirst,
      ).toHaveBeenCalledWith({
        where: { transactionId },
      });
      expect(
        prismaService.transactionStatus.findFirst,
      ).toHaveBeenCalledWith({
        where: { transactionId, To: null },
      });
    });
  });

  describe('getTransactionsByUser', () => {
    it('should return transactions for a given user', async () => {
      const userId = 'some-user-id';
      const mockTransactions = [
        /* array de transactions simulados para el usuario */
      ];

      (
        prismaService.transaction
          .findMany as jest.Mock
      ).mockResolvedValue(mockTransactions);

      const result =
        await service.getTransactionsByUser(
          userId,
        );
      expect(result).toEqual(mockTransactions);
    });
  });
  describe('createTransaction', () => {
    it('should create a new transaction and emit an event', async () => {
      // Datos simulados de entrada y salida
      const createInternalTransactionDto = {
        debitAccountId: 'debit-account-id',
        creditAccountId: 'credit-account-id',
        value: new Decimal(100),
        tranferTypeId: 1,
      };

      const mockTransaction = {
        transactionId: 'transaction-id',
        amount:
          createInternalTransactionDto.value,
      };

      const mockTransactionStatus = {
        transactionId:
          mockTransaction.transactionId,
        statusTransactionId: 'PENDING',
      };

      const emitDto: EmitTransactionDto = {
        transactionId:
          mockTransaction.transactionId,
        amount: mockTransaction.amount,
      };

      (
        prismaService.$transaction as jest.Mock
      ).mockImplementation(async (callback) => {
        return callback({
          transaction: {
            create: jest
              .fn()
              .mockResolvedValue(mockTransaction),
          },
          transactionStatus: {
            create: jest
              .fn()
              .mockResolvedValue(
                mockTransactionStatus,
              ),
          },
        });
      });

      (
        kafkaProducerService.emit as jest.Mock
      ).mockResolvedValue(null);

      const result =
        await service.createTransaction(
          createInternalTransactionDto,
        );

      expect(result).toEqual(mockTransaction);
      expect(
        prismaService.$transaction,
      ).toHaveBeenCalled();
      expect(
        kafkaProducerService.emit,
      ).toHaveBeenCalledWith(
        'transaction-created',
        emitDto,
      );
    });
  });
  // TODO: mas pruebas
});
