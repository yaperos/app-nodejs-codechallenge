import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Transactions (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should create a transaction', async () => {
    const transactionData = {
      accountExternalIdDebit: 'Guid',
      accountExternalIdCredit: 'Guid',
      tranferTypeId: 1,
      value: 120,
    };
    return request(app.getHttpServer())
      .post('/transactions')
      .send(transactionData)
      .expect(201)
      .expect((response) => {
        expect(response.body).toHaveProperty('id');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
