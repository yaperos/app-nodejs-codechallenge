import { Test, TestingModule } from '@nestjs/testing';

import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sendKafkaMessage } from 'src/kafka/kafka.producer';

import { Topics } from 'src/common/types/topicsNames';
import { TransactionService } from 'src/transactions/transaction.service';
import { TransactionsEntity } from 'src/transactions/entities/transaction.entity';
import { CreateTransactionDto } from 'src/transactions/dto/transaction.dto';

jest.mock('src/kafka/kafka.producer');

describe('TransactionService', () => {
  let service: TransactionService;
  let repository: Repository<TransactionsEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(TransactionsEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    repository = module.get<Repository<TransactionsEntity>>(
      getRepositoryToken(TransactionsEntity),
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a transaction and send Kafka message', async () => {
      // Arrange
      const data: CreateTransactionDto = {
        accountExternalIdDebit: '2a99fb82-5f60-44d9-8b95-628b4cd5fb6e',
        accountExternalIdCredit: '2a99fb82-5f60-44d9-8b95-628b4cd5fb6e',
        tranferTypeId: 1,
        value: 100,
      };
      const expectedTransaction: TransactionsEntity = {
        id: '2a99fb82-5f60-44d9-8b95-628b4cd5fb6e',
        accountExternalIdDebit: '2a99fb82-5f60-44d9-8b95-628b4cd5fb6e',
        accountExternalIdCredit: '2a99fb82-5f60-44d9-8b95-628b4cd5fb6e',
        tranferTypeId: 1,
        value: 100,
        status: 'pending',
        createdAt: new Date(),
      };

      jest.spyOn(repository, 'create').mockReturnValue(expectedTransaction);
      jest.spyOn(repository, 'save').mockResolvedValue(expectedTransaction);

      // Act
      const result = await service.create(data);

      // Assert
      expect(result).toEqual(expectedTransaction);
      expect(repository.create).toHaveBeenCalledWith(data);
      expect(repository.save).toHaveBeenCalledWith(expectedTransaction);

      // Verify if sendKafkaMessage was called with the correct parameters
      expect(sendKafkaMessage).toHaveBeenCalledWith(
        Topics.TRANSACTION_CREATED,
        JSON.stringify({
          transactionId: expectedTransaction.id,
          value: expectedTransaction.value,
          status: expectedTransaction.status,
        }),
      );
    });
  });
});
