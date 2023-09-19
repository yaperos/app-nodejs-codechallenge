import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('TransactionController E2E Test', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  let testTransactionCreated = null;
  const CREATE_TRANSACTION_URL = '/transactions';
  describe(`Creating a new trannsaction POST ${CREATE_TRANSACTION_URL}`, () => {
    it('should create a new transaction', async () => {
      const response = await request(app.getHttpServer())
        .post(CREATE_TRANSACTION_URL)
        .send({
          accountExternalIdDebit: 'Guid',
          accountExternalIdCredit: 'Guid',
          tranferTypeId: 1,
          value: 120,
        })
        .expect(201);
      testTransactionCreated = response.body;
      return response;
    });

    it('should return a 400 when missing attribute', () => {
      return request(app.getHttpServer())
        .post(CREATE_TRANSACTION_URL)
        .send({
          accountExternalIdCredit: 'Guid',
          tranferTypeId: 1,
          value: 120,
        })
        .expect(400);
    });

    it('should return a 400 when tranferTypeId is not 1 or 2', () => {
      return request(app.getHttpServer())
        .post(CREATE_TRANSACTION_URL)
        .send({
          accountExternalIdDebit: 'Guid',
          accountExternalIdCredit: 'Guid',
          tranferTypeId: 5,
          value: 120,
        })
        .expect(400);
    });

    it('should return a 400 when tranferTypeId is not a number', () => {
      return request(app.getHttpServer())
        .post(CREATE_TRANSACTION_URL)
        .send({
          accountExternalIdDebit: 'Guid',
          accountExternalIdCredit: 'Guid',
          tranferTypeId: '1',
          value: 120,
        })
        .expect(400);
    });
  });

  const GET_TRANSACTION_URL = '/transactions/:transactionExternalId';
  describe(`Getting a trannsaction GET ${GET_TRANSACTION_URL}`, () => {
    it('should get a transaction', () => {
      return request(app.getHttpServer())
        .get(`/transactions/${testTransactionCreated._id}`)
        .expect(200);
    });
    it('should return a 400 when param transactionExternalId is not a mongoId', () => {
      return request(app.getHttpServer()).get('/transactions/123').expect(400);
    });
  });
});
