import {
  CreateTransactionInput,
  TransactionClientProvider,
  TransactionOutput,
} from 'src/modules/transaction/domain/providers/transaction-client.provider';
import {
  DateMother,
  IntegerMother,
  UuidMother,
  WordMother,
} from 'tests/unit/modules/shared/domain/mothers';
import { FloatMother } from 'tests/unit/modules/shared/domain/mothers/float.mother';

export class MockTransactionClientProvider
  implements TransactionClientProvider
{
  private mockCreate = jest.fn();
  private mockFindOne = jest.fn();

  private transactionOnCreate: TransactionOutput;
  private transactionOnFindOne: TransactionOutput;

  returnOnCreate(transactionOutput: TransactionOutput): void {
    this.transactionOnCreate = transactionOutput;
  }

  async create(
    transactionCreateInput: CreateTransactionInput,
  ): Promise<TransactionOutput> {
    this.mockCreate(transactionCreateInput);
    return this.transactionOnCreate;
  }

  assertCreateHasBeenCalledWith(
    transactionCreateInput: CreateTransactionInput,
  ) {
    expect(this.mockCreate).toHaveBeenCalledWith(transactionCreateInput);
  }

  returnOnFindOne(transactionOutput: TransactionOutput): void {
    this.transactionOnFindOne = transactionOutput;
  }

  async findOne(transactionExternalId: string): Promise<TransactionOutput> {
    this.mockFindOne(transactionExternalId);
    return this.transactionOnFindOne;
  }

  assertFindOneHasBeenCalledWith(transactionExternalId: string) {
    expect(this.mockFindOne).toHaveBeenCalledWith(transactionExternalId);
  }
}

export class CreateTransactionInputMother {
  static create({
    accountExternalIdDebit = UuidMother.random(),
    accountExternalIdCredit = UuidMother.random(),
    tranferTypeId = IntegerMother.random({ min: 1, max: 3 }),
    value = FloatMother.random({ min: 1 }),
  }: {
    accountExternalIdDebit?: string;
    accountExternalIdCredit?: string;
    tranferTypeId?: number;
    value?: number;
  }): CreateTransactionInput {
    return {
      accountExternalIdDebit,
      accountExternalIdCredit,
      tranferTypeId,
      value,
    };
  }

  static random(): CreateTransactionInput {
    return {
      accountExternalIdDebit: UuidMother.random(),
      accountExternalIdCredit: UuidMother.random(),
      tranferTypeId: IntegerMother.random({ min: 1, max: 3 }),
      value: FloatMother.random({ min: 1 }),
    };
  }
}

export class TransactionOutputMother {
  static create({
    transactionExternalId = UuidMother.random(),
    transactionTypeName = WordMother.random(),
    transactionStatusName = WordMother.random(),
    value = FloatMother.random({ min: 1 }),
    createdAt = DateMother.random().toISOString(),
  }: {
    transactionExternalId?: string;
    transactionTypeName?: string;
    transactionStatusName?: string;
    value?: number;
    createdAt?: string;
  }): TransactionOutput {
    return {
      transactionExternalId,
      transactionType: {
        name: transactionTypeName,
      },
      transactionStatus: {
        name: transactionStatusName,
      },
      value,
      createdAt,
    };
  }

  static random(): TransactionOutput {
    return {
      transactionExternalId: UuidMother.random(),
      transactionType: {
        name: WordMother.random(),
      },
      transactionStatus: {
        name: WordMother.random(),
      },
      value: FloatMother.random({ min: 1 }),
      createdAt: DateMother.random().toISOString(),
    };
  }
}
