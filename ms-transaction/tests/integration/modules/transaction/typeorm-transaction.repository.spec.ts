import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/modules/transaction/domain/transaction';
import { TransactionCriteria } from 'src/modules/transaction/domain/transaction-criteria';
import { TransactionNotFoundError } from 'src/modules/transaction/domain/transaction-not-found.error';
import { ValidationStatus } from 'src/modules/transaction/domain/transaction-validation-status';
import { Transactions } from 'src/modules/transaction/domain/transactions';
import { TypeOrmTransactionEntity as TransactionEntity } from 'src/modules/transaction/infrastructure/persistence/typeorm-transaction.entity';
import { TypeOrmTransactionRepository as TransactionRepository } from 'src/modules/transaction/infrastructure/persistence/typeorm-transaction.repository';
import { UuidMother } from 'tests/unit/modules/shared/domain/mothers';
import { TransactionMother } from 'tests/unit/modules/transaction/domain/mothers/transaction.Mother';
import { DataSource } from 'typeorm';

import { TypeOrmTestingModule } from '../../base';

describe('TypeOrmTransactionRepository test', () => {
  let transactionRepository: TransactionRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ...TypeOrmTestingModule(),
        TypeOrmModule.forFeature([TransactionEntity]),
      ],
      providers: [TransactionRepository],
    }).compile();
    dataSource = moduleRef.get<DataSource>(DataSource);
    transactionRepository = moduleRef.get<TransactionRepository>(
      TransactionRepository,
    );
  });

  beforeEach(async () => {
    await dataSource.getRepository(TransactionEntity).clear();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it('should find transactions', async () => {
    const transaction1 = await createRandomTransaction(transactionRepository);
    const transaction2 = await createRandomTransaction(transactionRepository);
    const transaction3 = await createRandomTransaction(transactionRepository);
    const transactions = new Transactions([
      transaction1,
      transaction2,
      transaction3,
    ]);

    const findedTransactions = await transactionRepository.findTransactionsBy(
      TransactionCriteria.createEmpty(),
    );
    expect(findedTransactions).toEqual(transactions);
  });

  it('should not return transaction because it does not exist', async () => {
    const transaction = await transactionRepository.findOneTransactionBy(
      TransactionCriteria.createById(UuidMother.random()),
    );
    expect(transaction).toBeNull();
  });

  it('should create a transaction', async () => {
    const transaction = await createRandomTransaction(transactionRepository);

    const transactionCreated = await transactionRepository.findOneTransactionBy(
      TransactionCriteria.createById(transaction.getId()),
    );
    expect(transactionCreated).toEqual(transaction);
  });

  it('should test update a exists transaction', async () => {
    const transaction = await createRandomTransaction(transactionRepository);

    transaction.approveTransaction();
    await transactionRepository.updateTransaction(transaction);

    const transactionUpdated = await transactionRepository.findOneTransactionBy(
      TransactionCriteria.createById(transaction.getId()),
    );
    expect(transactionUpdated.getValidationStatus()).toEqual(
      ValidationStatus.APPROVED,
    );
    expect(transactionUpdated.getUpdatedAt()).toEqual(
      transaction.getUpdatedAt(),
    );
  });

  it('should throw error on update a not exists transaction', async () => {
    const transaction = TransactionMother.random();

    await expect(
      transactionRepository.updateTransaction(transaction),
    ).rejects.toThrow(TransactionNotFoundError);
  });

  it('should count transactions', async () => {
    let numTransactions = await transactionRepository.countTransactions(
      TransactionCriteria.createEmpty(),
    );
    expect(numTransactions).toEqual(0);

    const transaction1 = await createRandomTransaction(transactionRepository);
    numTransactions = await transactionRepository.countTransactions(
      TransactionCriteria.createById(transaction1.getId()),
    );
    expect(numTransactions).toEqual(1);

    const transaction2 = await createRandomTransaction(transactionRepository);
    numTransactions = await transactionRepository.countTransactions(
      TransactionCriteria.createByIds([
        transaction1.getId(),
        transaction2.getId(),
      ]),
    );
    expect(numTransactions).toEqual(2);

    numTransactions = await transactionRepository.countTransactions(
      TransactionCriteria.createById(transaction2.getId()),
    );
    expect(numTransactions).toEqual(1);
  });
});

const createRandomTransaction = async (
  transactionRepository: TransactionRepository,
): Promise<Transaction> => {
  const transaction = TransactionMother.random();
  await transactionRepository.createTransaction(transaction);
  return transaction;
};
