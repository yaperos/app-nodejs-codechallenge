import { Given, Then } from '@cucumber/cucumber';
import * as assert from 'assert';
import { Transaction } from 'src/modules/transaction/domain/transaction';
import {
  TRANSACTION_REPOSITORY_ALIAS,
  TransactionRepository,
} from 'src/modules/transaction/domain/transaction.repository';
import { TransactionCriteria } from 'src/modules/transaction/domain/transaction-criteria';
import { TypeOrmTransactionEntity } from 'src/modules/transaction/infrastructure/persistence/typeorm-transaction.entity';
import { TransactionMother } from 'tests/unit/modules/transaction/domain/mothers/transaction.Mother';
import { DataSource } from 'typeorm';

import { application, sleep } from '../hooks.steps';

let transactionRepository: TransactionRepository;

Given('only the transaction saved:', async (transaction: string) => {
  await clearTransactions();
  await createTransaction(JSON.parse(transaction));
});

Given('the transaction saved:', async (transaction: string) => {
  await createTransaction(JSON.parse(transaction));
});

Then('the transaction saved should be:', async (transaction: string) => {
  const transactionExpected = JSON.parse(transaction);
  const transactionSaved = await findOneTransaction(transactionExpected.id);
  assertPartialTransaction(
    transactionSaved.toPrimitives(),
    transactionExpected,
  );
});

function assertPartialTransaction(
  transaction: any,
  expectedPartial: any,
): void {
  for (const key in expectedPartial) {
    if (Object.prototype.hasOwnProperty.call(expectedPartial, key)) {
      assert.deepStrictEqual(transaction[key], expectedPartial[key]);
    }
  }
}

async function createTransaction(transaction: any) {
  initRepository();
  await transactionRepository.createTransaction(
    TransactionMother.create({ ...transaction }),
  );
  await sleep(5);
}

async function findOneTransaction(transactionId: string): Promise<Transaction> {
  initRepository();
  return transactionRepository.findOneTransactionBy(
    TransactionCriteria.createById(transactionId),
  );
}

async function clearTransactions() {
  const dataSource = application.get(DataSource);
  await dataSource.getRepository(TypeOrmTransactionEntity).clear();
}

function initRepository() {
  if (!transactionRepository) {
    transactionRepository = application.get<TransactionRepository>(
      TRANSACTION_REPOSITORY_ALIAS,
    );
  }
}
