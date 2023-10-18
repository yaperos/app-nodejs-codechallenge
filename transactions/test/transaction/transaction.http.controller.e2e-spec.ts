import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication, Scope, ValidationPipe } from '@nestjs/common';
import { TransactionHttpController } from '../../src/transaction/transaction.http.controller';
import { TransactionService } from '../../src/transaction/transaction.service';
import { TransactionRepository } from '../../src/transaction/repositories/transaction.repository';
import { CreateTransactionDto } from '../../src/transaction/dto/create-transaction.dto';
import { providersMock } from '../mocks/providersMock';
import { TransactionTypesConstant } from '../../src/transaction-type/constants/transaction-type.constant';
import { TransactionStatusConstant } from '../../src/transaction-status/constants/transaction-status.constant';
import { TransactionCreatedEvent } from 'shared-library-challenge/build/events/transaction-created.event';
import { CreateTransferRepository } from '../../src/transaction/repositories/create-transaction-repository';
import { TransactionController } from '../../src/transaction/transaction.controller';

const requestBody: CreateTransactionDto = {
  accountExternalIdCredit: '9035832f-5590-4e93-b13e-0f68b81217a7',
  accountExternalIdDebit: '4f60f1ad-9f4d-4448-8e7c-bb363f9e345f',
  transactionType: 1,
  value: 100,
};

describe('TransactionHttpController E2E - Request Http', () => {
  let controller: TransactionHttpController;
  let repository: TransactionRepository;
  let createTransferRepository: CreateTransferRepository;
  let service: TransactionService;

  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [TransactionController, TransactionHttpController],
      providers: [
        ...providersMock(),
        TransactionService,
        TransactionRepository,
        {
          provide: CreateTransferRepository,
          useClass: CreateTransferRepository,
          scope: Scope.DEFAULT, // TODOS LOS PROVIDERS QUE TENGAN SCOPE REQUESTE, DEBEN PONERSE EN DEFAULT SINO ROMPEN EL TEST
        },
      ],
    }).compile();

    controller = module.get<TransactionHttpController>(
      TransactionHttpController,
    );
    repository = module.get<TransactionRepository>(TransactionRepository);
    createTransferRepository = await module.resolve<CreateTransferRepository>(
      CreateTransferRepository,
    );
    service = module.get<TransactionService>(TransactionService);
    console.log('ppp', service);
    app = module.createNestApplication({});
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
        whitelist: true,
      }),
    );
    await app.init();
  });
  afterEach(async () => {
    await app.close();
  });

  it('should transaction http controller be defined', () => {
    expect(controller).toBeDefined();
  });

  it('POST /transaction fail when data send is incorrect', async () => {
    const bdReq = { aea: 123 };
    await request(app.getHttpServer())
      .post('/transaction')
      .send(bdReq)
      .expect(400);
  });

  it('POST /transaction work ok, return 201 and return data', async () => {
    const transactionCreated = await request(app.getHttpServer())
      .post('/transaction')
      .send(requestBody)
      .expect(201);

    expect(transactionCreated.body).toEqual({
      transactionExternalId: expect.stringMatching(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      ),
      transactionType: {
        name: TransactionTypesConstant.transfer.name,
      },
      transactionStatus: {
        name: TransactionStatusConstant.pending.name,
      },
      value: requestBody.value,
      createdAt: expect.anything(),
    });

    expect(
      Date.now() - new Date(transactionCreated.body.createdAt).getTime(),
    ).toBeLessThan(5000);
  });

  // it('POST /transaction Ok and Save in BD', async () => {
  //   const functions = [
  //     'create',
  //     'commitTransaction',
  //     'rollbackTransaction',
  //     'release',
  //   ] as const;
  //
  //   const spyMethods: Record<(typeof functions)[number], jest.SpyInstance> =
  //     {} as Record<(typeof functions)[number], jest.SpyInstance>;
  //
  //   functions.forEach((f) => {
  //     spyMethods[f] = jest.spyOn(createTransferRepository, f);
  //   });
  //
  //   await request(app.getHttpServer())
  //     .post('/transaction')
  //     .send(requestBody)
  //     .expect(201);
  //   expect(spyMethods.create).toHaveBeenCalledTimes(1);
  // });

  it('Transaction created emit event', async () => {
    const currentDate = new Date();
    const spyDate = jest
      .spyOn(global, 'Date')
      .mockImplementation(() => currentDate);

    const transactionCreated = await request(app.getHttpServer())
      .post('/transaction')
      .send(requestBody)
      .expect(201);

    expect(service['eventBus'].emit).toHaveBeenCalledTimes(1);

    const transactionEvent = new TransactionCreatedEvent({
      transaction_external_id: transactionCreated.body.transactionExternalId,
      value: requestBody.value,
    });
    transactionEvent.attributes.timestamp = currentDate;
    expect(service['eventBus'].emit).toHaveBeenCalledWith(transactionEvent);
    spyDate.mockRestore();
  });

  it('Should return transaccion when consult by id', async () => {
    const responseCreate = await request(app.getHttpServer())
      .post('/transaction')
      .send(requestBody)
      .expect(201);

    const responseGet = await request(app.getHttpServer())
      .get(`/transaction/${responseCreate.body.transactionExternalId}`)
      .expect(200);

    console.log('crea', responseCreate.body);
    console.log('consulta', responseGet.body);
    expect(responseGet.body).toEqual(responseCreate.body);
  });
});
