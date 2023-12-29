import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { Repository } from 'typeorm';
import { TransactionEntity } from 'src/models/transaction.entity';
import { KafkaService } from '../services/kafka.service';
import { StatusEnum, TransactionDto } from 'src/models/transaction.dto';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TransactionService', () => {
  let transactionService: TransactionService;
  let transactionRepository: Repository<TransactionEntity>;
  let kafkaService: KafkaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(TransactionEntity),
          useClass: Repository,
        },
        {
          provide: KafkaService,
          useValue: {
            sendMessage: jest.fn(),
          },
        },
      ],
    }).compile();

    transactionService = module.get<TransactionService>(TransactionService);
    transactionRepository = module.get<Repository<TransactionEntity>>(
      getRepositoryToken(TransactionEntity),
    );
    kafkaService = module.get<KafkaService>(KafkaService);
  });

  describe('getAll', () => {
    it('should return all transactions from the repository', async () => {
      // Arrange
      const mockTransactions: TransactionEntity[] = [
        // Mock some transactions
      ];
      jest
        .spyOn(transactionRepository, 'find')
        .mockResolvedValue(mockTransactions);

      // Act
      const result = await transactionService.getAll();

      // Assert
      expect(result).toEqual(mockTransactions);
      expect(transactionRepository.find).toHaveBeenCalled();
    });
  });

  describe('getOne', () => {
    it('should return a transaction by id from the repository', async () => {
      // Arrange
      const mockTransaction: TransactionEntity = {
        id: '69ad28b5-0b2f-4bf9-945e-f17b5977b8a9',
        accountExternalIdDebit: 'Guid',
        accountExternalIdCredit: 'Guid',
        transferTypeId: 1,
        value: 500,
        status: StatusEnum.PENDING,
        createdAt: new Date(),
      };
      jest
        .spyOn(transactionRepository, 'findOne')
        .mockResolvedValue(mockTransaction);

      // Act
      const result = await transactionService.getOne('mockId');

      // Assert
      expect(result).toEqual(mockTransaction);
      expect(transactionRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 'mockId',
        },
      });
    });
  });

  describe('save', () => {
    it('should save a transaction and send a Kafka message', async () => {
      // Arrange
      const mockTransaction: TransactionDto = {
        id: '69ad28b5-0b2f-4bf9-945e-f17b5977b8a9',
        accountExternalIdDebit: 'Guid',
        accountExternalIdCredit: 'Guid',
        transferTypeId: 1,
        value: 500,
        status: StatusEnum.PENDING,
        createdAt: new Date(),
      };
      jest
        .spyOn(transactionRepository, 'save')
        .mockResolvedValue(mockTransaction);
      jest.spyOn(kafkaService, 'sendMessage').mockImplementation();

      // Act
      const result = await transactionService.save(mockTransaction);

      // Assert
      expect(result).toEqual(mockTransaction);
      expect(transactionRepository.save).toHaveBeenCalledWith(mockTransaction);
      expect(kafkaService.sendMessage).toHaveBeenCalledWith(
        JSON.stringify(mockTransaction),
      );
    });

    it('should handle errors when saving a transaction', async () => {
      // Arrange
      const mockTransaction: TransactionDto = {
        id: '69ad28b5-0b2f-4bf9-945e-f17b5977b8a9',
        accountExternalIdDebit: 'Guid',
        accountExternalIdCredit: 'Guid',
        transferTypeId: 1,
        value: 500,
        status: StatusEnum.PENDING,
        createdAt: new Date(),
      };
      jest
        .spyOn(transactionRepository, 'save')
        .mockRejectedValue(new Error('Save error'));
      jest.spyOn(kafkaService, 'sendMessage').mockImplementation();

      // Act
      const result = await transactionService.save(mockTransaction);

      // Assert
      expect(result).toBeUndefined();
      expect(transactionRepository.save).toHaveBeenCalledWith(mockTransaction);
      expect(kafkaService.sendMessage).not.toHaveBeenCalled();
    });
  });

  describe('updateStatus', () => {
    it('should update the status of a transaction', async () => {
      // Arrange
      const mockUpdateResult = {
        affected: 1, // Assuming one record was affected by the update
        generatedMaps: [],
        raw: {},
      };
      jest
        .spyOn(transactionRepository, 'update')
        .mockResolvedValue(mockUpdateResult);

      // Act
      const result = await transactionService.updateStatus(
        'mockId',
        'newStatus',
      );

      // Assert
      expect(result).toEqual(mockUpdateResult);
      expect(transactionRepository.update).toHaveBeenCalledWith('mockId', {
        status: 'newStatus',
      });
    });

    it('should handle errors when updating the status of a transaction', async () => {
      // Arrange
      jest
        .spyOn(transactionRepository, 'update')
        .mockRejectedValue(new Error('Update error'));

      // Act
      const result = await transactionService.updateStatus(
        'mockId',
        'newStatus',
      );

      // Assert
      expect(result).toBeUndefined();
      expect(transactionRepository.update).toHaveBeenCalledWith('mockId', {
        status: 'newStatus',
      });
    });
  });
});
