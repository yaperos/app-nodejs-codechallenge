import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionController } from '../../../src/modules/transaction/transaction.controller';
import { TransactionService } from '../../../src/modules/transaction/transaction.service';
import { Transaction } from '../../../src/modules/transaction/entities/transaction.entity';
import {
  createTransactionDto,
  responseTransaction,
  responseUpdateTransaction,
  updateTransactionDto,
} from '../../../test/mock-data';

describe('TransactionController', () => {
  let controller: TransactionController;
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useClass: Repository,
        },
        {
          provide: 'KAFKA',
          useFactory: () => ({
            emit: jest.fn(),
          }),
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    service = module.get<TransactionService>(TransactionService);
  });

  describe('create', () => {
    it('should create a transaction', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(responseTransaction);
      jest.mock('uuid', () => ({
        v4: jest.fn().mockReturnValue('007cbe10-ebe4-4d68-ad97-c3870106285b'),
      }));
      expect(await controller.create(createTransactionDto)).toBe(
        responseTransaction,
      );
    });
  });

  describe('update', () => {
    it('should update a transaction', async () => {
      jest
        .spyOn(service, 'update')
        .mockResolvedValue(responseUpdateTransaction);
      expect(await controller.update(updateTransactionDto)).toBe(
        responseUpdateTransaction,
      );
    });
  });

  describe('findOne', () => {
    it('should findOne a transaction', async () => {
      const id = '007cbe10-ebe4-4d68-ad97-c3870106285b';
      jest.spyOn(service, 'findOne').mockResolvedValue(responseTransaction);
      expect(await controller.findOne(id)).toBe(responseTransaction);
    });
  });
});
