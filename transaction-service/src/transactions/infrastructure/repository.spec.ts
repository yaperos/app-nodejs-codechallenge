import { Test, TestingModule } from '@nestjs/testing';

import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { TransactionsRepository } from './repository';
import { RetrieveTransaction, TransactionStatus, TransactionType } from '../domain/transaction.entity';
import { CreateTransactionInput } from './dto/create-transaction.input';

describe('TransactionsRepository', () => {
  let transactionsRepository: TransactionsRepository;
  let transactionRepository: Repository<RetrieveTransaction>;
  let transactionStatusRepository: Repository<any>; 
  let transactionTypeRepository: Repository<any>; 

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsRepository,
        {
          provide: getRepositoryToken(RetrieveTransaction),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(TransactionStatus),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(TransactionType),
          useClass: Repository,
        },
      ],
    }).compile();

    transactionsRepository = module.get<TransactionsRepository>(
      TransactionsRepository,
    );
    transactionRepository = module.get<Repository<RetrieveTransaction>>(
      getRepositoryToken(RetrieveTransaction),
    );
    transactionStatusRepository = module.get<Repository<any>>(
      getRepositoryToken(TransactionStatus),
    );
    transactionTypeRepository = module.get<Repository<any>>(
      getRepositoryToken(TransactionType),
    );
  });

  it('should be defined', () => {
    expect(transactionsRepository).toBeDefined();
  });

  describe('retrieve', () => {
    it('should retrieve a transaction by ID', async () => {
      const mockTransaction = new RetrieveTransaction();
      jest
        .spyOn(transactionRepository, 'findOne')
        .mockResolvedValue(mockTransaction);

      const result = await transactionsRepository.retrieve('1');

      expect(result).toBe(mockTransaction);
    });

    it('should throw an error if the transaction is not found', async () => {
      jest
        .spyOn(transactionRepository, 'findOne')
        .mockResolvedValue(undefined);

      await expect(transactionsRepository.retrieve('1')).rejects.toThrowError(
        'La transacción con ID 1 no se encontró.',
      );
    });
  });

  describe('retrieveAll', () => {
    it('should retrieve all transactions', async () => {
      const mockTransactions: RetrieveTransaction[] = [
        new RetrieveTransaction(),
        new RetrieveTransaction(),
      ];

      jest
        .spyOn(transactionRepository, 'find')
        .mockResolvedValue(mockTransactions);

      const result = await transactionsRepository.retrieveAll();

      expect(result).toEqual(mockTransactions);
    });

  });

  describe('transaction', () => {
    it('should create and return a new transaction', async () => {
      const createTransactionInput: CreateTransactionInput = {
          value: 100,
          accountExternalIdDebit: 'debit-account-id',
          accountExternalIdCredit: '',
          tranferTypeId: 0
      };

      const mockTransactionStatus = new TransactionStatus();
      const mockTransactionType = new TransactionType();

      jest
        .spyOn(transactionStatusRepository, 'create')
        .mockReturnValueOnce(mockTransactionStatus);
      jest
        .spyOn(transactionStatusRepository, 'save')
        .mockResolvedValueOnce(mockTransactionStatus);

      jest
        .spyOn(transactionTypeRepository, 'create')
        .mockReturnValueOnce(mockTransactionType);
      jest
        .spyOn(transactionTypeRepository, 'save')
        .mockResolvedValueOnce(mockTransactionType);

      const mockRetrieveTransaction = new RetrieveTransaction();
      jest
        .spyOn(transactionRepository, 'create')
        .mockReturnValueOnce(mockRetrieveTransaction);
      jest
        .spyOn(transactionRepository, 'save')
        .mockResolvedValueOnce(mockRetrieveTransaction);

      const result = await transactionsRepository.transaction(
        createTransactionInput,
      );

      expect(result).toEqual(mockRetrieveTransaction);
    });

    it('should throw an error if an error occurs during transaction creation', async () => {
      const createTransactionInput: CreateTransactionInput = {
          value: 100,
          accountExternalIdDebit: 'debit-account-id',
          accountExternalIdCredit: '',
          tranferTypeId: 0
      };

      jest
        .spyOn(transactionStatusRepository, 'create')
        .mockImplementation(() => {
          throw new Error('Transaction Status Creation Error');
        });

      await expect(
        transactionsRepository.transaction(createTransactionInput),
      ).rejects.toThrowError('Transaction Status Creation Error');
    });
  });

  describe('delete', () => {
    it('should delete a transaction by ID', async () => {
      const mockDeleteResult: DeleteResult = {
        affected: 1,
        raw: {},
      };

      jest
        .spyOn(transactionRepository, 'delete')
        .mockResolvedValueOnce(mockDeleteResult);

      const result = await transactionsRepository.delete('1');

      expect(result).toEqual(mockDeleteResult);
    });

  });


  afterEach(() => {
    jest.restoreAllMocks();
  });
});
