import { of } from 'rxjs';
import { GrpcError } from 'src/modules/shared/domain/errors';
import { Uuid } from 'src/modules/shared/domain/value-object/uuid';
import { GrpcTransactionClientProvider } from 'src/modules/transaction/infrastructure/providers/grpc-transaction-client.provider';
import {
  TransactionData,
  TransactionResponse,
} from 'src/modules/transaction/infrastructure/resources/transaction.pb';

import {
  DateMother,
  IntegerMother,
  StringMother,
  UuidMother,
  WordMother,
} from '../../shared/domain/mothers';
import { FloatMother } from '../../shared/domain/mothers/float.mother';
import { MockClientGrpc } from '../../shared/infrastructure/mock-client-grpc';
import { CreateTransactionInputMother } from '../domain/providers/mock-transaction-client.provider';
import { MockTransactionClient } from './mock-transaction-client';

jest.mock('src/modules/shared/domain/errors/grpc.error', () => {
  return {
    ...jest.requireActual('src/modules/shared/domain/errors/grpc.error'),
    GrpcError: jest.fn(),
  };
});

describe('GrpcTransactionClientProvider test', () => {
  const transactionData: TransactionData = {
    id: UuidMother.random(),
    transferType: {
      id: StringMother.random(),
      name: WordMother.random(),
    },
    validationStatus: WordMother.random(),
    amount: FloatMother.random(),
    createdAt: DateMother.random().toISOString(),
  };
  const mockClientGrpc = new MockClientGrpc();
  const mockTransactionClient = new MockTransactionClient();
  const grpcTransactionClientProvider = new GrpcTransactionClientProvider(
    mockClientGrpc,
  );

  beforeAll(() => {
    mockClientGrpc.returOnGetService(mockTransactionClient);
    grpcTransactionClientProvider.onModuleInit();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be create transaction', async () => {
    const uuid = UuidMother.random();
    jest.spyOn(Uuid, 'random').mockReturnValue(new Uuid(uuid));

    const transactionResponse: TransactionResponse = {
      code: IntegerMother.random(),
      data: transactionData,
      error: null,
      messages: null,
    };
    mockTransactionClient.returnOnCreate(of(transactionResponse));

    const transactionInput = CreateTransactionInputMother.create({
      value: transactionData.amount,
    });
    const transactionOutput =
      await grpcTransactionClientProvider.create(transactionInput);

    expect(transactionOutput).toEqual({
      transactionExternalId: transactionData.id,
      transactionType: {
        name: transactionData.transferType.name,
      },
      transactionStatus: {
        name: transactionData.validationStatus,
      },
      value: transactionData.amount,
      createdAt: transactionData.createdAt,
    });
    mockTransactionClient.assertCreateByHasBeenCalledWith({
      id: uuid,
      creditAccountExternalId: transactionInput.accountExternalIdCredit,
      debitAccountExternalId: transactionInput.accountExternalIdDebit,
      transferType: `${transactionInput.tranferTypeId}`,
      amount: transactionInput.value,
    });
  });

  it('should be findOne transaction', async () => {
    const transactionResponse: TransactionResponse = {
      code: IntegerMother.random(),
      data: transactionData,
      error: null,
      messages: null,
    };
    mockTransactionClient.returnOnFindOne(of(transactionResponse));

    const transactionId = transactionData.id;
    const transactionOutput =
      await grpcTransactionClientProvider.findOne(transactionId);

    expect(transactionOutput).toEqual({
      transactionExternalId: transactionData.id,
      transactionType: {
        name: transactionData.transferType.name,
      },
      transactionStatus: {
        name: transactionData.validationStatus,
      },
      value: transactionData.amount,
      createdAt: transactionData.createdAt,
    });
    mockTransactionClient.assertFindOneByHasBeenCalledWith({
      id: transactionId,
    });
  });

  it('should throw a grpc error on create', async () => {
    const transactionResponse: TransactionResponse = {
      code: IntegerMother.random(),
      data: null,
      error: StringMother.random(),
      messages: [StringMother.random(), StringMother.random()],
    };
    mockTransactionClient.returnOnCreate(of(transactionResponse));

    const transactionInput = CreateTransactionInputMother.random();
    try {
      await grpcTransactionClientProvider.create(transactionInput);
      fail('Expected exception to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(GrpcError);
      expect(GrpcError).toHaveBeenCalledWith(
        transactionResponse.error,
        transactionResponse.code,
        transactionResponse.messages,
      );
    }
  });

  it('should throw a grpc error on findOne', async () => {
    const transactionResponse: TransactionResponse = {
      code: IntegerMother.random(),
      data: null,
      error: StringMother.random(),
      messages: [StringMother.random(), StringMother.random()],
    };
    mockTransactionClient.returnOnFindOne(of(transactionResponse));

    const transactionExternalId = UuidMother.random();
    try {
      await grpcTransactionClientProvider.findOne(transactionExternalId);
      fail('Expected exception to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(GrpcError);
      expect(GrpcError).toHaveBeenCalledWith(
        transactionResponse.error,
        transactionResponse.code,
        transactionResponse.messages,
      );
    }
  });
});
