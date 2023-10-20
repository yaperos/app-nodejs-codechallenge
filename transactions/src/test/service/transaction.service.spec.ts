import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from '../../core/transaction.service'
import { CreateTransactionRequestDto } from '../../common/dtos/request/create-transaction.dto';
import { Transaction } from '../../domain/model/transaction.model';
import { Status } from '../../common/constants/status.constant';
import { KafkaSender } from '../../../../core-library/src/sender/kafka.sender';
import { KafkaConstants } from '../../../../core-library/src/common/constants/kafka.constant';
import { TransactionResponse } from '../../common/dtos/response/transaction.response.dto';
import { v4 as uuidv4 } from 'uuid';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockRepository } from '../mocks/Repository.mock';
import { any } from 'joi';
import { Logger } from '@nestjs/common';
import { mockTransactionRepository } from '../mocks/transactionReposotiry.mock';

function createTransactionRequest(value: number): CreateTransactionRequestDto {
    const transaction = new CreateTransactionRequestDto();
    transaction.accountExternalIdCredit = uuidv4();
    transaction.accountExternalIdDebit = uuidv4();
    transaction.tranferTypeId = 1;
    transaction.value = value;
    return transaction;
}

function createTransaction(value: number): Transaction {
    const transaction = new Transaction();
    transaction.transactionExternalId = uuidv4();
    transaction.accountExternalIdCredit = uuidv4();
    transaction.accountExternalIdDebit = uuidv4();
    transaction.tranferTypeId = 1;
    transaction.value = value;
    transaction.status = Status.PENDING;
    return transaction;
}
  
function createTransactionResponse(
    id: string = uuidv4(),
    status: string,
    value: number,
    createdAt: Date
): TransactionResponse {
    const response = new TransactionResponse();
    response.transactionExternalId = id;
    response.transactionType = '1';
    response.transactionStatus = status;
    response.value = value;
    response.createdAt = createdAt;
    return response;
}
 
describe('TransactionService', () => {
  let service: TransactionService;
  let kafkaSender: KafkaSender;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTransactionRepository,
        },
        {
          provide: KafkaSender,
          useValue: {
            sendMessageToTopic: jest.fn(),
          },
        },
        Logger
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    kafkaSender = module.get<KafkaSender>(KafkaSender);
    logger = module.get<Logger>(Logger);
  });

  describe('create', () => {
    it('should create a new transaction', async () => {
      const value = 100;
      const createRequest = createTransactionRequest(value);
      const createdTransaction: Transaction = createTransaction(value);
      const createdTransactionResponse = createTransactionResponse(createdTransaction.transactionExternalId,Status.PENDING,value, createdTransaction.createdAt)
      const kafkaMessage = {
        id: createdTransaction.id,
        value: createdTransaction.value,
      };
      mockTransactionRepository.save.mockResolvedValue(createdTransaction);
      jest.spyOn(kafkaSender, 'sendMessageToTopic').mockResolvedValue(null);
      const result = await service.create(createRequest);

      expect(result).toEqual(createdTransactionResponse);
      expect(kafkaSender.sendMessageToTopic).toHaveBeenCalledTimes(1);
    });

    it('should fail when create a new transaction', async () => {
      const value = 100;
      const createRequest = createTransactionRequest(value);
      const createdTransaction: Transaction = createTransaction(value);
      const createdTransactionResponse = createTransactionResponse(createdTransaction.transactionExternalId,Status.PENDING,value, createdTransaction.createdAt)
      const kafkaMessage = {
        id: createdTransaction.id,
        value: createdTransaction.value,
      };
      mockTransactionRepository.save.mockRejectedValueOnce(new Error('unexpected error'))
      try {
        await service.create(createRequest);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Error: unexpected error');
      }
    });
  });

  
  describe('update', () => {
    it('should update a transaction', async () => {
      
      const value = 200;0
      const existingTransaction = createTransaction(value);
      existingTransaction.id =1;
      const fraudResponse = { id: '1', status: 'APPROVED' };
      mockTransactionRepository.findOneBy.mockReturnValueOnce(existingTransaction);
      const updatedTransaction = existingTransaction;
      updatedTransaction.status = Status.APPROVED;
      const createdTransactionResponse = createTransactionResponse(
          updatedTransaction.transactionExternalId,
          Status.APPROVED, 
          value, 
          existingTransaction.createdAt
        )
      mockTransactionRepository.save.mockReturnValueOnce(updatedTransaction);

      const result = await service.update({ message: fraudResponse });

      expect(result).toEqual(createdTransactionResponse);

    });

    it('should not find a transaction', async () => {
      
      const value = 200;0
      const existingTransaction = createTransaction(value);
      existingTransaction.id =1;
      const fraudResponse = { id: '1', status: 'APPROVED' };
      mockTransactionRepository.findOneBy.mockReturnValueOnce(null);
      const spyLogger = jest.spyOn(logger, 'error');

      await service.update({ message: fraudResponse });
      
      expect(spyLogger).toBeCalledTimes(1);
      expect(spyLogger).toBeCalledWith(`Transaction with ID ${existingTransaction.id} not found`)

    });

    it('should fail updating a transaction', async () => {
      
      const value = 200;0
      const existingTransaction = createTransaction(value);
      existingTransaction.id =1;
      const fraudResponse = { id: '1', status: 'APPROVED' };
      mockTransactionRepository.findOneBy.mockRejectedValueOnce(new Error('unexpected error'))
      const spyLogger = jest.spyOn(logger, 'error');

      await service.update({ message: fraudResponse });
      
      expect(spyLogger).toBeCalledTimes(1);
      expect(spyLogger).toBeCalledWith(`Fail to update transaction with ID: ${existingTransaction.id}`)

    });
  });

  describe('retrieve', () => {
    it('should retrieve a transaction by ID', async () => {
      const transactionId = uuidv4();
      const transaction = createTransaction(200);
      transaction.status = Status.APPROVED;
      const transactionResponse = createTransactionResponse(transactionId,Status.APPROVED,200, transaction.createdAt);
      transaction.transactionExternalId = transactionId;
      mockTransactionRepository.findOneBy.mockReturnValue(transaction);

      const result = await service.retrieve(transactionId);

      expect(result).toEqual(transactionResponse);
    });

    it('should fails when retrieve a transaction by ID', async () => {
      const transactionId = uuidv4();
      const transaction = createTransaction(200);
      transaction.status = Status.APPROVED;
      const transactionResponse = createTransactionResponse(transactionId,Status.APPROVED,200, transaction.createdAt);
      transaction.transactionExternalId = transactionId;
      mockTransactionRepository.findOneBy.mockReturnValue(null);

      try {
        await service.retrieve(transactionId);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe(`Transaction with id: ${transactionId} not found`);
      }
    });
  });
});
