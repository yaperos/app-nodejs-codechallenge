import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { TransactionService } from './transaction.service';

describe('AppController', () => {
  let controller: AppController;
  let service: jest.Mocked<TransactionService>;

  beforeEach(async () => {
    const serviceMock = {};

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: TransactionService, useValue: serviceMock }],
    }).compile();

    controller = module.get<AppController>(AppController);
    service = module.get(TransactionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have a TransactionService', () => {
    expect(service).toBeDefined();
  });
});
