import { CreateTransactionUseCase } from '../src/application/use-cases/create-transaction.usecase';
import { TransactionRepository } from '../src/domain/repositories/transaction.repository';
import { KafkaProducer } from '../src/infrastructure/kafka/kafka.producer';

describe('CreateTransactionUseCase', () => {
  let createTransactionUseCase: CreateTransactionUseCase;
  let mockRepository: jest.Mocked<TransactionRepository>;
  let mockKafkaProducer: jest.Mocked<KafkaProducer>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      updateStatus: jest.fn(),
    };
    mockKafkaProducer = {
      onModuleInit: jest.fn(),
      send: jest.fn(),
    } as any;

    createTransactionUseCase = new CreateTransactionUseCase(mockRepository, mockKafkaProducer);
  });

  it('debe crear una transacción con estado PENDING y emitir evento en Kafka', async () => {
    mockRepository.save.mockResolvedValue({
      transactionExternalId: 'fake-guid',
      accountExternalIdDebit: 'debit-guid',
      accountExternalIdCredit: 'credit-guid',
      transferTypeId: 1,
      value: 120,
      transactionStatus: 'PENDING',
      createdAt: new Date(),
    });

    const result = await createTransactionUseCase.execute({
      accountExternalIdDebit: 'debit-guid',
      accountExternalIdCredit: 'credit-guid',
      transferTypeId: 1,
      value: 120,
    });

    expect(result.transactionStatus).toBe('PENDING');
    expect(mockKafkaProducer.send).toHaveBeenCalledWith('transaction-created-topic', expect.any(Object));
  });
});
