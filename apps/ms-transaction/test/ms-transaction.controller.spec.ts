import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { MsTransactionController } from '../src/ms-transaction.controller';
import { MsTransactionService } from '../src/ms-transaction.service';
import { StatusResponse, TransactionRequest } from '../src/dto/transaction.dto';

describe('MsTransactionController', () => {
  let controller: MsTransactionController;
  let service: MsTransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MsTransactionController],
      providers: [
        {
          provide: MsTransactionService,
          useFactory: () => ({
            createTransaction: jest.fn(),
            getStatusTransaction: jest.fn(),
          }),
        },
      ],
    }).compile();

    controller = module.get<MsTransactionController>(MsTransactionController);
    service = module.get<MsTransactionService>(MsTransactionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTransaction', () => {
    it('should create a transaction and return the requestId', async () => {
      const transactionRequest: TransactionRequest = {
        requestId: 'test-request-id',
        accountExternalIdCredit: 'test-account-external',
        accountExternalIdDebit: 'test-account-debit',
        tranferTypeId: 1,
        value: 10,
      };
      const expectedResult = '123';

      jest
        .spyOn(service, 'createTransaction')
        .mockResolvedValue(expectedResult);

      const result = await controller.createTransaction(transactionRequest);

      expect(result).toBe(expectedResult);
    });
  });

  describe('getStatus', () => {
    it('should return the status of a transaction', async () => {
      const date = new Date().toISOString();
      const requestId = '123';
      const transaction: StatusResponse = {
        transactionExternalId: 'test-accountExternalIdDebit',
        transactionType: {
          name: 1,
        },
        transactionStatus: {
          name: 'status-test',
        },
        value: 1,
        createdAt: date,
      };

      jest
        .spyOn(service, 'getStatusTransaction')
        .mockResolvedValue(transaction);

      const result = await controller.getStatus(requestId);

      expect(result).toEqual(transaction);
    });

    it('should throw a NotFoundException if transaction is not found', async () => {
      const requestId = '123';

      jest.spyOn(service, 'getStatusTransaction').mockResolvedValue(null);

      try {
        await controller.getStatus(requestId);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.response.message).toEqual('Transaction not found');
        expect(e.response.statusCode).toEqual(404);
      }
    });
  });
});
