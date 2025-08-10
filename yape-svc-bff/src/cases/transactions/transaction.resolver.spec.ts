import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';

/* Project */
import { TransactionResolver } from './transaction.resolver';
import { TransactionProto } from '../../constants/grpc.constants';
import { CreateTransactionInput, RetrieveTransactionInput } from './dtos';
import { Transaction } from './models';

function makeTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    transactionId: 'tx-123',
    transactionType: { name: 'PAYMENT' },
    transactionStatus: { name: 'PENDING' },
    value: 100.5,
    createdAt: new Date('2025-01-01T00:00:00.000Z').toISOString(),
    ...overrides,
  } as Transaction;
}

const serviceMock = {
  CreateTransaction: jest.fn(),
  RetrieveTransaction: jest.fn(),
};

describe('TransactionResolver', () => {
  let resolver: TransactionResolver;

  let transactionClient: ClientGrpc;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionResolver,
        {
          provide: TransactionProto.service,
          useValue: {
            getService: jest.fn().mockReturnValue(serviceMock),
          },
        },
      ],
    }).compile();

    resolver = moduleRef.get(TransactionResolver);
    transactionClient = moduleRef.get<ClientGrpc>(TransactionProto.service);

    resolver.onModuleInit();
  });

  describe('onModuleInit', () => {
    it('should resolve the TransactionService from the ClientGrpc', () => {
      expect(transactionClient).toBeDefined();

      expect(transactionClient.getService).toHaveBeenCalledTimes(1);
      expect(transactionClient.getService).toHaveBeenCalledWith(
        TransactionProto.proto.service,
      );
    });
  });

  describe('createTransaction', () => {
    it('should call service.CreateTransaction and return the result', async () => {
      const input: CreateTransactionInput = {
        accountExternalIdDebit: 'acc-debit-1',
        accountExternalIdCredit: 'acc-credit-1',
        transferTypeId: 1,
        value: 250.75,
      } as CreateTransactionInput;

      const expected = makeTransaction(input);

      serviceMock.CreateTransaction.mockReturnValue(of(expected));

      const result = await resolver.createTransaction(input);

      expect(serviceMock.CreateTransaction).toHaveBeenCalledTimes(1);
      expect(serviceMock.CreateTransaction).toHaveBeenCalledWith(input);
      expect(result).toEqual(expected);
    });
  });

  describe('retrieveTransaction', () => {
    it('should call service.RetrieveTransaction and return the result', async () => {
      const input: RetrieveTransactionInput = {
        transactionId: 'tx-abc',
      };

      const expected = makeTransaction(input);

      serviceMock.RetrieveTransaction.mockReturnValue(of(expected));

      const result = await resolver.retrieveTransaction(input);

      expect(serviceMock.RetrieveTransaction).toHaveBeenCalledTimes(1);
      expect(serviceMock.RetrieveTransaction).toHaveBeenCalledWith(input);
      expect(result).toEqual(expected);
    });
  });
});
