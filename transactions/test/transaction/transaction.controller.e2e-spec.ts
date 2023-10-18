import { TransactionController } from '../../src/transaction/transaction.controller';
import { TransactionRepository } from '../../src/transaction/repositories/transaction.repository';
import { INestApplication, Scope, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { providersMock } from '../mocks/providersMock';
import { TransactionApprovedEvent } from 'shared-library-challenge/build/events/TransactionApprovedEvent';
import { TransactionRejectedEvent } from 'shared-library-challenge/build/events/TransactionRejectedEvent';
import { TransactionStatusIdsEnum } from '../../src/transaction-status/constants/transaction-status-ids.enum';
import { GetTransactionDtoV2 } from '../../src/transaction/dto/get-transaction.dto';
import { CreateTransferRepository } from '../../src/transaction/repositories/create-transaction-repository';
import { TransactionService } from '../../src/transaction/transaction.service';
import { TransactionHttpController } from '../../src/transaction/transaction.http.controller';
import * as request from 'supertest';

describe('TransactionController E2E - Subscribe topic', () => {
  let controller: TransactionController;
  let serviceTransaction: TransactionService;

  let app: INestApplication;

  let transactionCreatedWithValueLess1000: GetTransactionDtoV2;
  let approvedEventLess1000: TransactionApprovedEvent;

  let transactionCreatedWithValueGreater1000: GetTransactionDtoV2;
  let rejectedEventGreater1000: TransactionRejectedEvent;

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
          scope: Scope.DEFAULT,
        },
      ],
    })
      // .overrideProvider(CreateTransferRepository)
      // .useValue({
      //   provide: CreateTransferRepository,
      //   useClass: CreateTransferRepository,
      //   scope: Scope.DEFAULT,
      // })
      .compile();

    controller = module.get<TransactionController>(TransactionController);
    serviceTransaction = await module.resolve<TransactionService>(
      TransactionService,
    );

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

    // Minor 1000
    const responseLess1000 = await request(app.getHttpServer())
      .post('/transaction')
      .send({
        accountExternalIdCredit: '9035832f-5590-4e93-b13e-0f68b81217a7',
        accountExternalIdDebit: '4f60f1ad-9f4d-4448-8e7c-bb363f9e345f',
        transactionType: 1,
        value: 100,
      });
    transactionCreatedWithValueLess1000 = responseLess1000.body;
    approvedEventLess1000 = new TransactionApprovedEvent({
      transaction_external_id:
        transactionCreatedWithValueLess1000.transactionExternalId,
    });

    //greater than 1000
    const responseGreater1000 = await request(app.getHttpServer())
      .post('/transaction')
      .send({
        accountExternalIdCredit: '9035832f-5590-4e93-b13e-0f68b81217a7',
        accountExternalIdDebit: '4f60f1ad-9f4d-4448-8e7c-bb363f9e345f',
        transactionType: 1,
        value: 100,
      });
    transactionCreatedWithValueGreater1000 = responseGreater1000.body;
    rejectedEventGreater1000 = new TransactionRejectedEvent({
      transaction_external_id:
        transactionCreatedWithValueGreater1000.transactionExternalId,
    });
  });
  afterEach(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  it('should transaction http controller be defined', () => {
    expect(controller['transactionService']).toBeDefined();
    expect(controller).toBeDefined();
  });
  it('should serviceTransaction be defined', () => {
    expect(serviceTransaction).toBeDefined();
  });

  it('Receive event transactionApproved and update in BD', async () => {
    expect(serviceTransaction).toBeDefined();
    const spyServiceUpateStatusTransaction = jest.spyOn(
      serviceTransaction,
      'updateStatusTransaction',
    );
    await controller.transactionApproved(approvedEventLess1000);
    expect(spyServiceUpateStatusTransaction).toHaveBeenCalledTimes(1);
    expect(spyServiceUpateStatusTransaction).toHaveBeenCalledWith(
      approvedEventLess1000.data.transaction_external_id,
      TransactionStatusIdsEnum.approvedId,
    );
    spyServiceUpateStatusTransaction.mockRestore();
  });
  it('Receive event transactionRejected and update in BD', async () => {
    const spyServiceUpateStatusTransaction = jest.spyOn(
      serviceTransaction,
      'updateStatusTransaction',
    );
    await controller.transactionRejected(rejectedEventGreater1000);
    expect(spyServiceUpateStatusTransaction).toHaveBeenCalledTimes(1);
    expect(spyServiceUpateStatusTransaction).toHaveBeenCalledWith(
      rejectedEventGreater1000.data.transaction_external_id,
      TransactionStatusIdsEnum.rejectedId,
    );
    spyServiceUpateStatusTransaction.mockRestore();
  });
});
