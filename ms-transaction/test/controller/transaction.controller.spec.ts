import { Test, TestingModule } from '@nestjs/testing';

import { TransactionUseCase } from 'src/application/transaction';

import { NotFoundException } from '@nestjs/common';
import { TransactionController } from 'src/infraestructure/controller/transaction.controller';
import { ProducerService } from 'src/infraestructure/message/kafka/producer.service';
import { CreateTransactionDto } from 'src/infraestructure/controller/transaction.validation';
import { Status } from 'src/helper/const.helper';

describe('TransactionController', () => {
  let controller: TransactionController;
  let transactionUseCase: TransactionUseCase;
  let producerService: ProducerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionUseCase,
          useValue: {
            registerTrx: jest.fn(),
            findTrx: jest.fn(),
            updateStatus: jest.fn(),
          },
        },
        {
          provide: ProducerService,
          useValue: {
            produce: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    transactionUseCase = module.get<TransactionUseCase>(TransactionUseCase);
    producerService = module.get<ProducerService>(ProducerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('registerTransaction', () => {
    it('should register a transaction and emit a message', async () => {
      const createTransactionDto: CreateTransactionDto = {
        accountExternalIdDebit: "6616566d-7246-4a88-bf9b-72659d22fa4a",
        accountExternalIdCredit: "39db9f3a-41d6-49ab-bc3f-48fa478f573e",
        tranferTypeId: 2,
        value: 123
      };

      const result = {
        id: "e6062e92-e0ca-4d60-a9d6-d2cc436cdb9d",
        accountExternalIdDebit: "6616566d-7246-4a88-bf9b-72659d22fa4a",
        accountExternalIdCredit: "39db9f3a-41d6-49ab-bc3f-48fa478f573e",
        tranferTypeId: 2,
        tranferType:{
            id:2,
            name:"Type"
        },
        value: 123,
        status: Status.PENDING,
        createdAt: new Date("2024-01-28T07:35:25.761Z"),
        updatedAt:new Date("2024-01-28T07:35:25.761Z")
      } 

      jest.spyOn(transactionUseCase, 'registerTrx').mockResolvedValue(result);
      jest.spyOn(producerService, 'produce').mockResolvedValue();

      const response = await controller.registerTransaction(createTransactionDto);

      expect(response).toEqual(result);
      expect(transactionUseCase.registerTrx).toHaveBeenCalledWith(createTransactionDto);
      expect(producerService.produce).toHaveBeenCalledWith('transactionTopic', {
        value: JSON.stringify(result),
      });
    });
  });

  describe('getTransaction', () => {
    it('should get a transaction by ID', async () => {
      const transactionId = 'e6062e92-e0ca-4d60-a9d6-d2cc436cdb9d';
      const result = {
        transactionExternalId: "e6062e92-e0ca-4d60-a9d6-d2cc436cdb9d",
        transactionType: {
            name: "typeTwo"
        },
        transactionStatus: {
            name: "APPROVED"
        },
        value: 123,
        createdAt:new Date("2024-01-28T07:35:25.761Z")
      }
      jest.spyOn(transactionUseCase, 'findTrx').mockResolvedValue(result);

      const response = await controller.getTransaction(transactionId);

      expect(response).toEqual(result);
      expect(transactionUseCase.findTrx).toHaveBeenCalledWith(transactionId);
    });

    it('should throw NotFoundException if transaction is not found', async () => {
      const transactionId = 'non-existent-id';

      jest.spyOn(transactionUseCase, 'findTrx').mockResolvedValue(null);

      await expect(controller.getTransaction(transactionId)).rejects.toThrow(NotFoundException);
      expect(transactionUseCase.findTrx).toHaveBeenCalledWith(transactionId);
    });
  });

});
