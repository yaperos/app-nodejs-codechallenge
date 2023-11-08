import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { TransactionResolver } from '../../../../src/modules/transaction/transaction.resolver';
import { of } from 'rxjs';
import {
  mockCreateTransaction,
  mockParamasCreateTransaction,
  mockReturnCreateTransaction,
} from '../../../mock-data';
import {
  axiosResponseMock,
  mockGetTransaction,
  mockReturnGetTransaction,
} from '../../../mock-data';
describe('TransactionResolver', () => {
  let resolver: TransactionResolver;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionResolver,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
            post: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<TransactionResolver>(TransactionResolver);
    httpService = module.get<HttpService>(HttpService);
  });

  describe('getTransaction', () => {
    it('should return a transaction', async () => {
      const transaction = mockGetTransaction;

      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() =>
          of(axiosResponseMock(mockGetTransaction)),
        );

      const result = await resolver.getTransaction({
        transactionExternalId: transaction.id,
      });

      expect(httpService.get).toHaveBeenCalledWith(
        `http://external-api.com/transactions/${transaction.id}`,
      );

      expect(result).toEqual(mockReturnGetTransaction);
    });
  });

  describe('createTransaction', () => {
    it('should create a transaction', async () => {
      const transactionCreate = mockParamasCreateTransaction;
      const transaction = mockCreateTransaction;
      jest
        .spyOn(httpService, 'post')
        .mockImplementationOnce(() => of(axiosResponseMock(transaction)));

      const result = await resolver.createTransaction(transactionCreate);

      expect(httpService.post).toHaveBeenCalledWith(
        'http://external-api.com/transactions',
        transactionCreate,
      );
      expect(result).toEqual(mockReturnCreateTransaction);
    });
  });
});
