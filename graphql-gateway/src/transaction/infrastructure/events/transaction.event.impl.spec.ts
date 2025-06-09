import { Test, TestingModule } from '@nestjs/testing';
import { ClientKafka } from '@nestjs/microservices';
import { of } from 'rxjs';
import TransactionEventImpl from './transaction.event.impl';
import CreateTransaction from 'src/transaction/domain/dtos/createTransaction';
import { GRAPHQL_TRANSACTION_PRODUCER } from '../../commons/tokens';
import { createMockTransactionEntity } from '../../../../test/factories/transactionEntity.factory';

describe('TransactionEventImpl', () => {
  let service: TransactionEventImpl;
  let clientKafkaMock: jest.Mocked<ClientKafka>;

  beforeEach(async () => {
    const mockKafkaClient = {
      send: jest.fn(),
      subscribeToResponseOf: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionEventImpl,
        {
          provide: GRAPHQL_TRANSACTION_PRODUCER,
          useValue: mockKafkaClient,
        },
      ],
    }).compile();

    service = module.get(TransactionEventImpl);
    clientKafkaMock = module.get(GRAPHQL_TRANSACTION_PRODUCER);
  });

  it('should emit transaction_create event', async () => {
    const input: CreateTransaction = {
      accountExternalIdDebit: 'acc-1',
      accountExternalIdCredit: 'acc-2',
      value: 100,
      transferTypeId: 1,
    };

    const transactionExpected = createMockTransactionEntity();

    clientKafkaMock.send.mockReturnValueOnce(of(transactionExpected));

    const result = await service.emitTransactionCreate(input);

    expect(clientKafkaMock.send).toHaveBeenCalledWith('transaction_create', JSON.stringify(input));
    expect(result).toEqual(transactionExpected);
  });

  it('should emit transaction_get_by_id event', async () => {
    const transactionId = 'tx-456';
    const transaction = createMockTransactionEntity();
    transaction.id = transactionId;

    clientKafkaMock.send.mockReturnValueOnce(of(transaction));

    const result = await service.emitTransactionGetById(transactionId);

    expect(clientKafkaMock.send).toHaveBeenCalledWith('transaction_get_by_id', transactionId);
    expect(result).toEqual(transaction);
  });

  it('should subscribe to Kafka topics on init', () => {
    service.onModuleInit();

    expect(clientKafkaMock.subscribeToResponseOf).toHaveBeenCalledWith('transaction_create');
    expect(clientKafkaMock.subscribeToResponseOf).toHaveBeenCalledWith('transaction_get_by_id');
  });
});
