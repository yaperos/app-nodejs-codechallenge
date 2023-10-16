import { Test, TestingModule } from '@nestjs/testing';
import { TransactionResolver } from './transaction.resolver';
import { HttpService } from '@nestjs/axios';
import { Logger } from '@logger/logger.service';
import { mockTransactionRequest, mockTransactionResponse } from './mock-data';

describe('TransactionResolver', () => {
  let transactionResolver: TransactionResolver;
  let spyHttpService: HttpService;
  let spyLogger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionResolver,
        {
          provide: HttpService,
          useFactory: () => ({
            axiosRef: {
              get: jest.fn(() => ({
                toPromise: () => null,
              })),
              post: jest.fn(() => ({
                toPromise: () => null,
              })),
            },
          }),
        },
        {
          provide: Logger,
          useFactory: () => ({
            log: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            error: jest.fn(),
          }),
        },
      ],
    }).compile();

    transactionResolver = module.get<TransactionResolver>(TransactionResolver);
    spyHttpService = module.get<HttpService>(HttpService);
    spyLogger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(transactionResolver).toBeDefined();
  });

  describe('getTransaction', () => {
    it('should get transaction by external ID', async () => {
      jest
        .spyOn(spyHttpService.axiosRef, 'get')
        .mockResolvedValueOnce({ data: mockTransactionResponse });
      const loggerSpy = jest.spyOn(spyLogger, 'log');

      await transactionResolver.getTransaction({
        transactionExternalId: 'exampleId',
      });

      expect(loggerSpy).toHaveBeenCalledWith(
        'Fetching transaction by externalId',
      );
    });

    it('should throw an error and call logger.error in case of an error', async () => {
      const loggerErrorSpy = jest.spyOn(spyLogger, 'error');
      const transactionExternalId = 'exampleId';

      const mockError = new Error('test error');
      jest
        .spyOn(spyHttpService.axiosRef, 'get')
        .mockRejectedValueOnce(mockError);

      try {
        await transactionResolver.getTransaction({ transactionExternalId });
      } catch (e) {
        expect(loggerErrorSpy).toHaveBeenCalledWith(
          'Error fetching transaction',
          mockError.message,
        );
      }
    });
  });

  describe('createTransaction', () => {
    it('should call the logger with the correct message', async () => {
      const loggerSpy = jest.spyOn(spyLogger, 'log');
      jest
        .spyOn(spyHttpService.axiosRef, 'post')
        .mockResolvedValueOnce({ data: mockTransactionResponse });

      await transactionResolver.createTransaction(mockTransactionRequest);

      expect(loggerSpy).toHaveBeenCalledWith('Start create transaction');
    });

    it('should throw an error and call logger.error in case of an error', async () => {
      const loggerErrorSpy = jest.spyOn(spyLogger, 'error');

      const errorMessage = 'Some error message';
      jest
        .spyOn(spyHttpService.axiosRef, 'post')
        .mockRejectedValueOnce(new Error(errorMessage));

      try {
        await transactionResolver.createTransaction(mockTransactionRequest);
      } catch (e) {
        expect(loggerErrorSpy).toHaveBeenCalledWith(
          'Error in create transaction',
          errorMessage,
        );
      }
    });
  });
});
