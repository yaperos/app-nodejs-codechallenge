import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TransactionsModule } from './../src/transactions.module';
import { TransactionRepositoryContract } from './../src/repositories/transactions/transaction.repository.contract';
import { TransactionTypeRepositoryContract } from './../src/repositories/transaction-types/transaction-type.repository.contract';
import { Transaction, TransactionType } from '@app/common';

class TransactionTypeRepositoryMock
  implements TransactionTypeRepositoryContract
{
  findById(id: number): Promise<TransactionType> {
    if (id === 1) {
      return Promise.resolve(null);
    }
    return Promise.resolve({ id: 2, name: 'Payroll payments' });
  }
}

class TransactionRepositoryMock implements TransactionRepositoryContract {
  private data: Transaction[] = [
    {
      transactionExternalId: '0c376feb-736b-4737-93be-182529b9439f',
      value: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
      transactionType: { id: 2, name: 'Payroll payments' },
      status: 'PENDING',
    },
  ];

  findById(id: string): Promise<Transaction> {
    const found = this.data.find((trx) => trx.transactionExternalId === id);
    return Promise.resolve(found);
  }

  findAll(_take?: number, _skip?: number): Promise<Transaction[]> {
    return Promise.resolve(this.data);
  }

  save(input: Transaction): Promise<Transaction> {
    if (input.transactionType.id === 1) {
      throw new Error("Transaction type doesn't");
    }

    return Promise.resolve({ ...this.data[0], ...input });
  }
}

describe('Api Graphql', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TransactionsModule],
    })
      .overrideProvider('TRANSACTION_REPOSITORY')
      .useClass(TransactionRepositoryMock)
      .overrideProvider('TRANSACTION_TYPE_REPOSITORY')
      .useClass(TransactionTypeRepositoryMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('Transactions', () => {
    it('should get the transactions array', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query:
            'query {transactions { transactionExternalId transactionType { name } transactionStatus { name } value createdAt }}',
        })
        .expect(200)
        .expect((res) => {
          const transactions = res.body.data.transactions;
          expect(transactions.length).toEqual(1);
          const transaction = transactions[0];
          expect(transaction.transactionExternalId).toBeDefined();
          expect(transaction.value).toEqual(200);
          expect(transaction.transactionType.name).toEqual('Payroll payments');
          expect(transaction.transactionStatus.name).toEqual('PENDING');
          expect(transaction.createdAt).toBeDefined();
        });
    });

    it('should get a transaction', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query:
            'query {transaction(id: "VHJhbnNhY3Rpb246MGMzNzZmZWItNzM2Yi00NzM3LTkzYmUtMTgyNTI5Yjk0Mzlm") { transactionExternalId transactionType { name } transactionStatus { name } value createdAt }}',
        })
        .expect(200)
        .expect((res) => {
          const transaction = res.body.data.transaction;
          expect(transaction.transactionExternalId).toBeDefined();
          expect(transaction.value).toEqual(200);
          expect(transaction.transactionType.name).toEqual('Payroll payments');
          expect(transaction.transactionStatus.name).toEqual('PENDING');
          expect(transaction.createdAt).toBeDefined();
        });
    });

    describe('Create transaction', () => {
      it('should create a transaction', () => {
        return request(app.getHttpServer())
          .post('/graphql')
          .send({
            query:
              'mutation($input: CreateTransactionInput!) { createTransaction(input: $input) { success message transaction { transactionExternalId value createdAt updatedAt transactionStatus { name } transactionType { name } }}}',
            variables: {
              input: {
                accountExternalIdDebit:
                  'QWNjb3VudEV4dGVybmFsSWREZWJpdDpkM2U0MTViYS0yNmZiLTRhNGUtYTY2Mi03MzY1Nzc3MmE0ZWE=',
                accountExternalIdCredit:
                  'QWNjb3VudEV4dGVybmFsSWRDcmVkaXQ6M2ZmMTQ3NjEtZGRmOC00Y2RlLTg4MjQtMjc0MDgxM2IxYzg5',
                tranferTypeId: 'VHJhbnNhY3Rpb25UeXBlOjI=',
                value: 120,
              },
            },
          })
          .expect(200)
          .expect((res) => {
            const data = res.body.data.createTransaction;
            expect(data.success).toBeTruthy();
            expect(data.message).toEqual('Transaction saved!');
            const transaction = data.transaction;
            expect(transaction.transactionExternalId).toBeDefined();
            expect(transaction.value).toEqual(120);
            expect(transaction.transactionType.name).toEqual(
              'Payroll payments',
            );
            expect(transaction.transactionStatus.name).toEqual('PENDING');
            expect(transaction.createdAt).toBeDefined();
          });
      });

      it('should return transaction type does not exist', () => {
        return request(app.getHttpServer())
          .post('/graphql')
          .send({
            query:
              'mutation($input: CreateTransactionInput!) { createTransaction(input: $input) { success message transaction { transactionExternalId value createdAt updatedAt transactionStatus { name } transactionType { name } }}}',
            variables: {
              input: {
                accountExternalIdDebit:
                  'QWNjb3VudEV4dGVybmFsSWREZWJpdDpkM2U0MTViYS0yNmZiLTRhNGUtYTY2Mi03MzY1Nzc3MmE0ZWE=',
                accountExternalIdCredit:
                  'QWNjb3VudEV4dGVybmFsSWRDcmVkaXQ6M2ZmMTQ3NjEtZGRmOC00Y2RlLTg4MjQtMjc0MDgxM2IxYzg5',
                tranferTypeId: 'VHJhbnNhY3Rpb25UeXBlOjE=',
                value: 120,
              },
            },
          })
          .expect(200)
          .expect((res) => {
            const data = res.body.data.createTransaction;
            expect(data.success).toBeFalsy();
            expect(data.message).toEqual("Transaction type doesn't");
            expect(data.transaction).toBeNull();
          });
      });
    });
  });
});
