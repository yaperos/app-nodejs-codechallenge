import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { TransactionEvent } from 'src/events/transaction.event';
import { DataSource } from 'typeorm';
import { UserFactory } from 'src/factory/user.factory';
import { User } from 'src/entities/user';
import { UserAccountFactory } from 'src/factory/userAccount.factory';
import { UserAccount } from 'src/entities/userAccount';
import { TransferTypeFactory } from 'src/factory/transferType.factory';
import { TransferType } from 'src/entities/transferType';
import { TransactionStatus } from 'src/common/transaction.type';
import { TestingUtil } from 'src/utils/testing';
import { randomUUID } from 'crypto';

let app: INestApplication;
let dataSource: DataSource;
let testingUtil: TestingUtil;

beforeAll(async () => {
  const module = await Test.createTestingModule({
    imports: [AppModule],
    providers: [TestingUtil],
  }).compile();

  app = module.createNestApplication();
  dataSource = module.get<DataSource>(DataSource);
  testingUtil = module.get<TestingUtil>(TestingUtil);
  await testingUtil.cleanDataBase();

  await app.init();
});

afterAll(async () => {
  await app.close();
  // await dataSource.destroy();
});

describe('transactionController', () => {
  let spy: jest.SpyInstance;
  let user1: User;
  let user2: User;
  let account1: UserAccount;
  let account2: UserAccount;
  let transferType: TransferType;

  beforeEach(async () => {
    await testingUtil.cleanDataBase();
    [user1, user2] = await Promise.all([
      UserFactory.create(
        {
          name: 'user1',
          email: 'user1@gmail.com',
          password: '213',
        },
        dataSource,
      ),
      UserFactory.create(
        {
          name: 'user2',
          email: 'user2@gmail.com',
          password: '213',
        },
        dataSource,
      ),
    ]);

    [account1, account2, transferType] = await Promise.all([
      UserAccountFactory.create(
        {
          userId: user1.id,
        },
        dataSource,
      ),
      UserAccountFactory.create(
        {
          userId: user2.id,
        },
        dataSource,
      ),
      TransferTypeFactory.create(
        {
          name: 'Debit',
        },
        dataSource,
      ),
    ]);
  });

  describe('POST - /transaction', () => {
    const route = '/transaction';

    test('OK - Transaction is created successfully', async () => {
      spy = jest
        .spyOn(TransactionEvent.prototype, 'created')
        .mockImplementation(() => {});

      const { status, body } = await request(app.getHttpServer())
        .post(route)
        .send({
          accountExternalIdDebit: account1.id,
          accountExternalIdCredit: account2.id,
          transferTypeId: transferType.id,
          value: 20,
        })
        .set('Accept', 'application/json');

      expect(status).toBe(201);

      expect(spy).toBeCalledTimes(1);
      expect(body.transactionExternalId).toBeDefined();
      expect(body.transactionType.name).toBe(transferType.name);
      expect(body.transactionStatus.name).toBe(TransactionStatus.pending);
      expect(body.value).toBe(20);
      expect(body.createdAt).toBeDefined();
    });

    test('ERROR - External accounts are invalid', async () => {
      spy = jest
        .spyOn(TransactionEvent.prototype, 'created')
        .mockImplementation(() => {});

      const { status, body } = await request(app.getHttpServer())
        .post(route)
        .send({
          accountExternalIdDebit: randomUUID(),
          accountExternalIdCredit: account2.id,
          transferTypeId: transferType.id,
          value: 20,
        })
        .set('Accept', 'application/json');

      expect(status).toBe(400);
      expect(body.message).toBe('External accounts are invalid');
    });

    test('ERROR - Transfer type invalid', async () => {
      spy = jest
        .spyOn(TransactionEvent.prototype, 'created')
        .mockImplementation(() => {});

      const { status, body } = await request(app.getHttpServer())
        .post(route)
        .send({
          accountExternalIdDebit: account1.id,
          accountExternalIdCredit: account2.id,
          transferTypeId: 5,
          value: 20,
        })
        .set('Accept', 'application/json');

      expect(status).toBe(400);
      expect(body.message).toBe('Transfer type invalid');
    });
  });
});
