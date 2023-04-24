import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { TRANSACTION_STATUS } from './interfaces/transaction.status.interface';

describe('TransactionService', () => {
  let service: TransactionService;
  let repository: Repository<Transaction>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: 'ANTI_FRAUD_PACKAGE',
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    repository = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTransaction', () => {
    let result: any;
    let expected: any;

    beforeEach(() => {
      result = {
        uuid: '14e90d43-8698-46d3-9f00-ac6065e0ffdf',
        tranfer_type: 'immediate',
        status: 'pending',
        value: 100,
        created_at: new Date('2023-04-23T00:00:00.000Z'),
      };

      expected = {
        transactionExternalId: '14e90d43-8698-46d3-9f00-ac6065e0ffdf',
        transactionType: {
          name: 'immediate',
        },
        transactionStatus: {
          name: 'pending',
        },
        value: 100,
        createdAt: '2023-04-23T00:00:00.000Z',
        error: null,
      };
    });

    it('should return a transaction', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(result);
      const response = await service.getTransaction(
        '14e90d43-8698-46d3-9f00-ac6065e0ffdf',
      );
      expect(response).toEqual(expected);
    });

    it('should return a transaction with scheduled type', async () => {
      result.tranfer_type = 'scheduled';
      expected.transactionType.name = 'scheduled';
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(result);
      const response = await service.getTransaction(
        '14e90d43-8698-46d3-9f00-ac6065e0ffdf',
      );
      expect(response).toEqual(expected);
    });

    it('should return a transaction with immediate type', async () => {
      result.tranfer_type = 'immediate';
      expected.transactionType.name = 'immediate';
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(result);
      const response = await service.getTransaction(
        '14e90d43-8698-46d3-9f00-ac6065e0ffdf',
      );
      expect(response).toEqual(expected);
    });
  });

  describe('createTransaction', () => {
    let expected: any;
    let newTransaction: any;
    let createTransaction: any;
    let request: any;

    beforeEach(() => {
      newTransaction = {
        accountexternal_id_debit: '574ad7c9-9868-4715-8706-cfa0ec0ff533',
        accountexternal_id_credit: '2da0d33e-020e-49a7-8403-2ef97b157a6f',
        tranfer_type: 'immediate',
        value: 100,
        status: TRANSACTION_STATUS.PENDING,
      };

      createTransaction = {
        uuid: '14e90d43-8698-46d3-9f00-ac6065e0ffdf',
        accountexternal_id_debit: '574ad7c9-9868-4715-8706-cfa0ec0ff533',
        accountexternal_id_credit: '2da0d33e-020e-49a7-8403-2ef97b157a6f',
        tranfer_type: 'immediate',
        value: 100,
        status: TRANSACTION_STATUS.PENDING,
        created_at: new Date('2023-04-23T00:00:00.000Z'),
      };

      request = {
        accountexternalIdDebit: '574ad7c9-9868-4715-8706-cfa0ec0ff533',
        accountexternalIdCredit: '2da0d33e-020e-49a7-8403-2ef97b157a6f',
        tranferTypeId: 2,
        value: 100,
      };

      expected = {
        transactionExternalId: '14e90d43-8698-46d3-9f00-ac6065e0ffdf',
        transactionType: {
          name: 'immediate',
        },
        transactionStatus: {
          name: 'pending',
        },
        value: 100,
        createdAt: '2023-04-23T00:00:00.000Z',
      };
    });

    it('should return a transaction', async () => {
      jest.spyOn(repository, 'create').mockReturnValueOnce(newTransaction);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(createTransaction);
      const response = await service.createTransaction(request);
      expect(response).toEqual(expected);
    });
  });
});
