/* eslint-disable @typescript-eslint/unbound-method */
import { CreateTransactionService } from './create-transaction.service';
import { TransactionPostgresRepository } from '../adapter/out/db/postgres/transaction-postgres.repository';
import { TransactionKafkaProducer } from '../adapter/out/messaging/kafka/transaction-kafka.producer';
import { Logger } from 'nestjs-pino';
import { CreateTransactionInputDto } from '../dto/create-transaction-input.dto';
import { TransactionType } from '../entity/transaction-type.enum';
import { TransactionStatus } from '../entity/transaction-status.enum';

describe('CreateTransactionService', () => {
  let service: CreateTransactionService;
  let transactionDbRepo: jest.Mocked<TransactionPostgresRepository>;
  let transactionProducer: jest.Mocked<TransactionKafkaProducer>;
  let logger: jest.Mocked<Logger>;

  beforeEach(() => {
    transactionDbRepo = {} as jest.Mocked<TransactionPostgresRepository>;
    transactionProducer = {} as jest.Mocked<TransactionKafkaProducer>;
    logger = {} as jest.Mocked<Logger>;
    logger.debug = jest.fn();
    service = new CreateTransactionService(
      transactionDbRepo,
      transactionProducer,
      logger,
    );
  });

  it('given valid transaction input, should create a transaction with correct properties', async () => {
    transactionDbRepo.save = jest.fn();
    transactionProducer.produceTransactionCreatedEvent = jest.fn();

    const createTransactionInputDto: CreateTransactionInputDto = {
      amount: 100,
      accountExternalIdDebit: 'debit-123',
      accountExternalIdCredit: 'credit-456',
      transferType: TransactionType.CREDIT,
    };

    const result = await service.create(createTransactionInputDto);

    expect(result).toBeDefined();
    expect(result.amount).toBe(100);
    expect(result.accountExternalIdDebit).toBe('debit-123');
    expect(result.accountExternalIdCredit).toBe('credit-456');
    expect(result.status).toBe(TransactionStatus.PENDING);
    expect(transactionDbRepo.save).toHaveBeenCalledWith(result);
    expect(
      transactionProducer.produceTransactionCreatedEvent,
    ).toHaveBeenCalledWith(result);
  });
});
