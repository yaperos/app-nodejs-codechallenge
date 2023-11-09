import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../../../src/modules/transaction/entities/transaction.entity';
import { TransactionService } from '../../../src/modules/transaction/transaction.service';
import { CreateAntiFraudDto } from '../../../../msa-fraud/src/modules/anti-fraud/dto/create-anti-fraud.dto';
import {
  createTransactionDto,
  responseTransaction,
  responseUpdateTransaction,
  updateTransactionDto,
} from '../../../test/mock-data';
import { ClientKafka } from '@nestjs/microservices';

describe('TransactionService', () => {
  let service: TransactionService;
  let repository: Repository<Transaction>;
  let kafkaClient: ClientKafka;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<TransactionService>(TransactionService);
    repository = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
    kafkaClient = module.get<ClientKafka>('KAFKA');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a transaction', async () => {
      jest.spyOn(repository, 'save').mockResolvedValueOnce(responseTransaction);
      const createAntiFraudDto: CreateAntiFraudDto = {
        id: '007cbe10-ebe4-4d68-ad97-c3870106285b',
        amount: 100,
      };

      const result = await service.create(createTransactionDto);
      expect(kafkaClient.emit).toHaveBeenCalledWith(
        'transaction-fraud',
        createAntiFraudDto,
      );
      expect(result).toEqual(responseTransaction);
      expect(repository.save).toHaveBeenCalledWith(createTransactionDto);
    });

    it('should create a transaction error', async () => {
      jest.spyOn(repository, 'save').mockResolvedValueOnce(responseTransaction);
      jest.spyOn(kafkaClient, 'emit').mockImplementationOnce(() => {
        throw new Error();
      });
      await service.create(createTransactionDto);
    });
  });

  describe('findOne', () => {
    it('should return a transaction', async () => {
      const id = '007cbe10-ebe4-4d68-ad97-c3870106285b';
      const transaction = new Transaction();
      transaction.id = id;
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(transaction);
      const result = await service.findOne(id);
      expect(result).toEqual(transaction);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
    });
  });

  describe('update', () => {
    it('should update a transaction', async () => {
      jest
        .spyOn(repository, 'update')
        .mockResolvedValueOnce(responseUpdateTransaction);

      const result = await service.update(
        updateTransactionDto.id,
        updateTransactionDto,
      );

      expect(result).toEqual(responseUpdateTransaction);
      expect(repository.update).toHaveBeenCalled();
    });
  });
});
