import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { mockCreate, mockSave } from '../mockDataTest';

class MockTransactionRepository {
  create() {}
  save() {}
  async preload() {}
}
describe('TransactionService', () => {
  let service: TransactionService;
  let repository: Repository<Transaction>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useClass: MockTransactionRepository,
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
  describe('create', () => {
    it('should create a transaction', async () => {
      const mockTransactionDto: CreateTransactionDto = mockCreate;

      const mockCreatedTransaction: Transaction = mockSave;

      jest.spyOn(repository, 'create').mockReturnValue(mockCreatedTransaction);
      jest
        .spyOn(repository, 'save')
        .mockReturnValue(Promise.resolve(mockCreatedTransaction));

      const result = await service.create(mockTransactionDto);
      expect(repository.create).toHaveBeenCalledTimes(1);
      expect(repository.create).toHaveBeenCalledWith(mockTransactionDto);
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(mockCreatedTransaction);
      expect(result).toEqual(mockCreatedTransaction);
    });

    it('should throw InternalServerErrorException if creation fails', async () => {
      const mockTransactionDto: CreateTransactionDto = mockCreate;

      jest.spyOn(repository, 'create').mockImplementation(() => {
        throw new Error();
      });
      await expect(service.create(mockTransactionDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    it('should update a transaction', async () => {
      const mockId = 'mockId';
      const mockStatus = 'mockStatus';
      const mockTransaction: Transaction = mockSave;

      jest.spyOn(repository, 'preload').mockResolvedValue(mockTransaction);
      jest
        .spyOn(repository, 'save')
        .mockReturnValue(Promise.resolve(mockTransaction));

      const result = await service.update(mockId, mockStatus);
      expect(repository.preload).toHaveBeenCalledTimes(1);
      expect(repository.preload).toHaveBeenCalledWith({
        id: mockId,
        transactionStatus: mockStatus,
      });
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(mockTransaction);
      expect(result).toEqual(mockTransaction);
    });

    it('should throw NotFoundException if transaction is not found', async () => {
      const mockId = 'nonExistentId';
      const mockStatus = 'mockStatus';

      jest.spyOn(repository, 'preload').mockResolvedValue(undefined);

      await expect(service.update(mockId, mockStatus)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
