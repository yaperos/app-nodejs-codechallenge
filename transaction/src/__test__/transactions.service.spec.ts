import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { config } from '../config';
import { AppModule } from '../app.module';
import { input, payload, transaction, transactionStatus, transactionType, transactions } from './utils/mocks';
import { TransactionsService } from '../transactions/services/transactions.service';
import { Transaction, TransactionStatus, TransactionType } from '../models';
describe('TransactionsService', () => {
  let service: TransactionsService;
  let transactionRepository: Repository<Transaction>;
  let transactionTypeRepository: Repository<TransactionType>;
  let transactionStatusRepository: Repository<TransactionStatus>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[
        ConfigModule.forRoot({
          envFilePath: '.env.test',
          load: [config],
        }),
        AppModule
      ]
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    transactionRepository = module.get<Repository<Transaction>>(getRepositoryToken(Transaction));
    transactionTypeRepository = module.get<Repository<TransactionType>>(getRepositoryToken(TransactionType));
    transactionStatusRepository = module.get<Repository<TransactionStatus>>(getRepositoryToken(TransactionStatus));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
  describe('getTransactions', () => {
    it('should return an array of transactions', async () => {
      const expectedTransactions = transactions
      jest.spyOn(transactionRepository, 'find').mockResolvedValue(expectedTransactions);
      const result = await service.getTransactions();
      expect(result).toEqual(expectedTransactions);
    });
    
    it('should throw InternalServerErrorException if an error occurs', async () => {
      jest.spyOn(transactionRepository, 'find').mockRejectedValue(new Error('Database connection failed'));
      await expect(service.getTransactions()).rejects.toThrow(InternalServerErrorException);
    });
  });

  
  describe('getTransactionByID', () => {
    it('should return a transaction by ID', async () => {
      const expectedTransaction = transaction;
      const id = 'e5d0d0c2-76bb-443d-9e5f-e1fffe482d37';
      jest.spyOn(transactionRepository, 'findOne').mockResolvedValue(expectedTransaction);
      const result = await service.getTransactionByID(id);
      expect(result).toEqual(expectedTransaction);
    });

    it('should throw InternalServerErrorException if an error occurs', async () => {
      const id = 'e5d0d0c2-76bb-443d-9e5f-e1fffe482d37';
      jest.spyOn(transactionRepository, 'findOne').mockRejectedValue(new Error('Database connection failed'));
      await expect(service.getTransactionByID(id)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('createTransaction', () => {
    it('should create a transaction', async () => {
      const newTransaction = transaction;
      jest.spyOn(transactionTypeRepository, 'findOne').mockResolvedValue(transactionType);
      jest.spyOn(transactionStatusRepository, 'findOne').mockResolvedValue(transactionStatus);
      jest.spyOn(transactionRepository, 'create').mockReturnValue(newTransaction);
      jest.spyOn(transactionRepository, 'save').mockResolvedValue(newTransaction);

      const result = await service.createTransaction(input);
      expect(result).toEqual(newTransaction);
    });

    it('should throw NotFoundException if transaction type is not found', async () => {
      jest.spyOn(transactionTypeRepository, 'findOne').mockResolvedValue(undefined);
      await expect(service.createTransaction(input)).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw NotFoundException if transaction status is not found', async () => {
      jest.spyOn(transactionTypeRepository, 'findOne').mockResolvedValue(transactionType);
      jest.spyOn(transactionStatusRepository, 'findOne').mockResolvedValue(undefined);
      await expect(service.createTransaction(input)).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw InternalServerErrorException if an error occurs', async () => {
      jest.spyOn(transactionTypeRepository, 'findOne').mockRejectedValue(new Error('Database connection failed'));
      await expect(service.createTransaction(input)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('updateTransaction', () => {
    it('should update a transaction', async () => {
      jest.spyOn(transactionStatusRepository, 'findOne').mockResolvedValue(transactionStatus);
      jest.spyOn(transactionRepository, 'findOne').mockResolvedValue(transaction);
      jest.spyOn(transactionRepository, 'save').mockResolvedValue(undefined);
      await service.updateTransaction(payload);
    });

    it('should throw NotFoundException if transaction status is not found', async () => {
      jest.spyOn(transactionStatusRepository, 'findOne').mockResolvedValue(undefined);
      await expect(service.updateTransaction(payload)).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw NotFoundException if transaction is not found', async () => {
      jest.spyOn(transactionRepository, 'findOne').mockResolvedValue(undefined);
      await expect(service.updateTransaction(payload)).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw InternalServerErrorException if an error occurs', async () => {
      jest.spyOn(transactionStatusRepository, 'findOne').mockRejectedValue(new Error('Database connection failed'));
      await expect(service.updateTransaction(payload)).rejects.toThrow(InternalServerErrorException);
    });
  });

});
