import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest'; // 👈 CAMBIO CLAVE
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma.service';

jest.mock('../kafka/transaction.producer', () => ({
  sendTransactionCreated: jest.fn(),
}));

describe('TransactionsController (e2e)', () => {
  let app: INestApplication;

  const prismaMock = {
    transaction: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [AppModule],
      })
        .overrideProvider(PrismaService)
        .useValue(prismaMock)
        .compile();

    app = moduleFixture.createNestApplication();

    // 🔒 mismas validaciones que prod
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

    it('/POST transactions', async () => {
    prismaMock.transaction.create.mockResolvedValue({
      transactionExternalId: 'tx-uuid',
      accountExternalIdDebit: 'uuid-1',
      accountExternalIdCredit: 'uuid-2',
      tranferTypeId: 1,
      value: 100,
      status: 'pending',
      createdAt: new Date(),
    });

    const response = await request(app.getHttpServer())
      .post('/transactions')
      .send({
        accountExternalIdDebit: '550e8400-e29b-41d4-a716-446655440000',
        accountExternalIdCredit: '550e8400-e29b-41d4-a716-446655440001',
        tranferTypeId: 1,
        value: 100,
      })
      .expect(201);

    expect(response.body.transactionExternalId).toBe('tx-uuid');
    expect(response.body.status).toBe('pending');
  });

    it('/GET transactions/:id', async () => {
    prismaMock.transaction.findUnique.mockResolvedValue({
      transactionExternalId: 'tx-uuid',
      tranferTypeId: 1,
      value: 100,
      status: 'approved',
      createdAt: new Date(),
    });

    const response = await request(app.getHttpServer())
      .get('/transactions/tx-uuid')
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        transactionExternalId: 'tx-uuid',
        transactionType: { name: 'Yapeo' },
        transactionStatus: { name: 'approved' },
        value: 100,
      }),
    );
  });
});