import { Test, TestingModule } from '@nestjs/testing';
import { MsTransactionService } from '../src/ms-transaction.service';
import { TransactionDbService } from '../src/db/transaction/transaction.service';

const transactionDbServiceMock = {
  createTransaction: jest.fn(),
  updateTransactionStatus: jest.fn(),
  getTransactionStatus: jest.fn(),
};
const clientKafkaMock = {
  emit: jest.fn(),
};

describe('MsTransactionService', () => {
  let service: MsTransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MsTransactionService,
        {
          provide: TransactionDbService,
          useValue: transactionDbServiceMock,
        },
        {
          provide: 'KAFKA_CLIENT',
          useValue: clientKafkaMock,
        },
      ],
    }).compile();

    service = module.get<MsTransactionService>(MsTransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTransaction', () => {
    it('should create a transaction and emit it to Kafka', async () => {
      const transactionRequest = {
        requestId: 'test-request-id',
        accountExternalIdCredit: 'test-account-external',
        accountExternalIdDebit: 'test-account-debit',
        tranferTypeId: 1,
        value: 10,
      };
      const expectedResult = 'test-request-id';

      transactionDbServiceMock.createTransaction.mockResolvedValueOnce(
        undefined,
      );

      const result = await service.createTransaction(transactionRequest);

      expect(result).toBe(expectedResult);
      expect(transactionDbServiceMock.createTransaction).toHaveBeenCalledWith(
        transactionRequest,
      );
      expect(clientKafkaMock.emit).toHaveBeenCalledWith(
        'topic.anti.fraud.pending',
        JSON.stringify({
          requestId: 'test-request-id',
          value: 10,
        }),
      );
    });
  });

  describe('updateTransaction', () => {
    it('should update the status of a transaction', async () => {
      const transactionStatus = {
        requestId: 'test-request-id',
        status: 'status-test',
      };

      transactionDbServiceMock.updateTransactionStatus.mockResolvedValueOnce(
        undefined,
      );

      await service.updateTransaction(transactionStatus);

      expect(
        transactionDbServiceMock.updateTransactionStatus,
      ).toHaveBeenCalledWith(transactionStatus.requestId, {
        status: transactionStatus.status,
      });
    });
  });

  describe('getStatusTransaction', () => {
    it('should return the status of a transaction', async () => {
      const requestId = 'test-request-id';
      const date = new Date().toISOString;
      const transaction = {
        requestId,
        status: 'status-test',
        accountExternalIdDebit: 'test-accountExternalIdDebit',
        accountExternalIdCredit: 'test-accountExternalIdCredit',
        tranferTypeId: 1,
        value: 1,
        createdAt: date,
      };

      transactionDbServiceMock.getTransactionStatus.mockResolvedValueOnce(
        transaction,
      );

      const result = await service.getStatusTransaction(requestId);

      expect(result).toEqual({
        transactionExternalId: 'test-accountExternalIdDebit',
        transactionType: {
          name: 1,
        },
        transactionStatus: {
          name: 'status-test',
        },
        value: 1,
        createdAt: date,
      });
      expect(
        transactionDbServiceMock.getTransactionStatus,
      ).toHaveBeenCalledWith(requestId);
    });

    it('should return null if the transaction is not found', async () => {
      const requestId = '123';

      transactionDbServiceMock.getTransactionStatus.mockResolvedValueOnce(null);

      const result = await service.getStatusTransaction(requestId);

      expect(result).toBeNull();
    });
  });
});
