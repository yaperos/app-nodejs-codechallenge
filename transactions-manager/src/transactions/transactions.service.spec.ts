import { Repository } from 'typeorm';
import { TransactionsService } from './transactions.service';
import { KafkaService } from '../kafka/kafka.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from '../database/entities/transaction.entity';
import { TransactionStatusName, UpdateTransactionDto } from './dto/update-transaction.dto';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let repository: jest.Mocked<Repository<Transaction>>;
  let kafkaService: jest.Mocked<KafkaService>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
    } as any;

    kafkaService = {
      sendMessage: jest.fn(),
    } as any;

    service = new TransactionsService(repository, kafkaService);
  });

  it('should create a transaction', async () => {
    const dto: CreateTransactionDto = {
      accountExternalIdDebit: 'accountExternalIdDebit',
      accountExternalIdCredit: 'accountExternalIdCredit',
      tranferTypeId: 1,
      value: 100,
    };
    const transaction = new Transaction();
    transaction.value = dto.value;
    transaction.tranferTypeId = 1;
    transaction.accountExternalIdCredit = 'test-credit';
    transaction.accountExternalIdDebit = 'test-debit';
    transaction.transactionStatus = { name: 'pending' };
    repository.create.mockReturnValue(transaction);
    repository.save.mockResolvedValue(transaction);

    const result = await service.create(dto);

    expect(repository.create).toHaveBeenCalledWith({
      ...dto,
      transactionStatus: { name: 'pending' },
    });
    expect(repository.save).toHaveBeenCalledWith(transaction);
    expect(kafkaService.sendMessage).toHaveBeenCalledWith(
      'transactions_created',
      {
        uuid: transaction.uuid,
        value: transaction.value,
      },
    );
    expect(result).toEqual(transaction);
  });

  it('should update a transaction', async () => {
    const dto: UpdateTransactionDto = {
      uuid: 'test-uuid',
      transactionStatus: { name: TransactionStatusName.APPROVED },
    };
    const transaction = new Transaction();
    Object.assign(transaction, dto);
    repository.findOneBy.mockResolvedValue(transaction);

    await service.update(dto);

    expect(repository.findOneBy).toHaveBeenCalledWith({ uuid: dto.uuid });
    expect(repository.update).toHaveBeenCalledWith(transaction.uuid, dto);
  });

  it('should find all transactions', async () => {
    const transactions: Transaction[] = [
      {
        uuid: 'test-uuid',
        value: 100,
        accountExternalIdDebit: 'test-debit',
        accountExternalIdCredit: 'test-credit',
        tranferTypeId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    repository.find.mockResolvedValue(transactions);

    const result = await service.findAll();

    expect(repository.find).toHaveBeenCalled();
    expect(result).toEqual(transactions);
  });

  it('should find one transaction', async () => {
    const uuid = 'test-uuid';
    const transaction = { uuid: 'test-uuid', value: 100 };
    const transactionInstance = new Transaction();
    Object.assign(transactionInstance, transaction);
    repository.findOneBy.mockResolvedValue(transactionInstance);

    const result = await service.findOne(uuid);

    expect(repository.findOneBy).toHaveBeenCalledWith({ uuid });
    expect(result).toEqual(transactionInstance);
  });
});
