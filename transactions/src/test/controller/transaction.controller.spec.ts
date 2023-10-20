import { Test, TestingModule } from '@nestjs/testing';
import { CreateTransactionRequestDto } from '../../common/dtos/request/create-transaction.dto';
import { TransactionResponse } from '../../common/dtos/response/transaction.response.dto';
import { TransactionController } from '../../app/controller/transaction.controller';
import { v4 as uuidv4} from 'uuid'
import { Status } from '../../common/constants/status.constant';
import { TransactionService } from '../../core/transaction.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from '../../domain/model/transaction.model';
import { mockRepository } from '../mocks/Repository.mock';
import { Logger } from '@nestjs/common';
import { KafkaSender } from '../../../../core-library/src/sender/kafka.sender';

describe('TransactionController', () => {
  let controller: TransactionController;
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: getRepositoryToken(Transaction),
          useClass: mockRepository
        },
        TransactionService,
        KafkaSender,
        Logger
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    service = module.get<TransactionService>(TransactionService);
  });

  describe('create', () => {
    it('should create a new transaction', async () => {
      const createRequest = new CreateTransactionRequestDto();
      createRequest.accountExternalIdCredit = uuidv4();
      createRequest.accountExternalIdDebit = uuidv4(),
      createRequest.tranferTypeId = 1;
      createRequest.value = 200;
      const transactionResponse= new TransactionResponse();
      transactionResponse.transactionStatus = Status.PENDING;
      transactionResponse.transactionType = '1';
      transactionResponse.value = 200;
      jest.spyOn(service, 'create').mockResolvedValue(transactionResponse);

      const result = await controller.create(createRequest);
      expect(result.transactionExternalId).not.toBe(null);
      expect(result.transactionStatus).toEqual(transactionResponse.transactionStatus);
      expect(result.value).toEqual(transactionResponse.value);
      expect(result.transactionType).toEqual(transactionResponse.transactionType);

    });
  });

  describe('retrieveTransaction', () => {
    it('should retrieve a transaction by ID', async () => {
      const transactionId: string = uuidv4();
      const transactionResponse= new TransactionResponse();
      transactionResponse.transactionExternalId = transactionId;
      transactionResponse.transactionStatus = Status.PENDING;
      transactionResponse.transactionType = '1';
      transactionResponse.value = 200;

      jest.spyOn(service, 'retrieve').mockResolvedValue(transactionResponse);

      const result = await controller.retrieveTransaction(transactionId);
      expect(result).toEqual(transactionResponse);
    });
  });
});