import * as supertest from 'supertest';
import * as assert from 'assert';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';

describe('Transaction Catalog Test', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('Transaction Catalog Test', () => {
    it('TCT-001 Get transactions catalog by type', async () => {
      const { statusCode, body } = await supertest(app.getHttpServer())
        .get('/transaction-catalog')
        .query({ type: 'TRANSACTION_STATUS' })
        .send();

      assert.equal(statusCode, 200, 'A correct answer is expected');
      assert.equal(
        body[0].name,
        'PENDING',
        'Expected receive database register',
      );
    });

    it('TCT-002 Get transactions catalog by other type', async () => {
      const { statusCode, body } = await supertest(app.getHttpServer())
        .get('/transaction-catalog')
        .query({ type: 'TRANSACTION_TYPE' })
        .send();

      assert.equal(statusCode, 200, 'A correct answer is expected');
      assert.equal(
        body[0].name,
        'CREDIT',
        'Expected receive database register',
      );
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
