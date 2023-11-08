import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from '../entities/transaction.entity';
import { Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';

const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOneBy: jest.fn(),
};

const mockClientKafka = {
  emit: jest.fn(),
};

describe('TransactionsService', () => {
  let service: TransactionsService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let repository: Repository<Transaction>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let kafkaClient: ClientKafka;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockRepository,
        },
        {
          provide: 'KAFKA_SERVICE',
          useValue: mockClientKafka,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    repository = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
    kafkaClient = module.get<ClientKafka>('KAFKA_SERVICE');
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a transaction', async () => {
      const transactionDto = {
        accountExternalIdDebit: 'uuid-debit',
        accountExternalIdCredit: 'uuid-credit',
        transferTypeId: 1,
        value: 500,
      };
      const transaction = {
        ...transactionDto,
        id: 'uuid',
        status: 'pending',
        createdAt: new Date(),
      };
      mockRepository.create.mockReturnValue(transaction);
      mockRepository.save.mockResolvedValue(transaction);

      const result = await service.create(transactionDto);

      expect(mockRepository.create).toHaveBeenCalledWith(transactionDto);
      expect(mockRepository.save).toHaveBeenCalledWith(transaction);
      expect(result).toEqual(transaction);
      expect(mockClientKafka.emit).toHaveBeenCalledWith(
        'verify_transaction',
        transaction,
      );
    });

    it('should reject a transaction with a value greater than 1000', async () => {
      const transactionDto = {
        accountExternalIdDebit: 'uuid-debit',
        accountExternalIdCredit: 'uuid-credit',
        transferTypeId: 1,
        value: 1500,
      };
      const rejectedTransaction = {
        ...transactionDto,
        id: 'uuid',
        status: 'rejected',
        createdAt: new Date(),
      };
      mockRepository.create.mockReturnValue(rejectedTransaction);
      mockRepository.save.mockResolvedValue(rejectedTransaction);

      const result = await service.create(transactionDto);

      expect(mockRepository.create).toHaveBeenCalledWith(transactionDto);
      expect(mockRepository.save).toHaveBeenCalledWith(rejectedTransaction);
      expect(result.status).toBe('rejected');
      expect(mockClientKafka.emit).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should retrieve a transaction by id', async () => {
      const transaction = {
        id: 'uuid',
        status: 'approved',
        createdAt: new Date(),
      };
      mockRepository.findOneBy.mockResolvedValue(transaction);

      const result = await service.findOne('uuid');

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 'uuid' });
      expect(result).toEqual(transaction);
    });
  });
});
