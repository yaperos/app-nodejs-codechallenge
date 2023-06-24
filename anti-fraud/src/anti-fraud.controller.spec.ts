import { AntiFraudController } from './anti-fraud.controller';
import { TransactionCreatedEvent } from './event/transaction-created-event';
import { Test, TestingModule } from '@nestjs/testing';
import { AntiFraudService } from './anti-fraud.service';
import { randomUUID } from 'crypto';

describe('AntiFraudController', () => {
  let controller: AntiFraudController;
  let antiFraudServiceMock;

  beforeEach(async () => {
    antiFraudServiceMock = {
      handleTransactionCreated: jest.fn(
        (data: TransactionCreatedEvent): void => {
          console.log('Handling transaction created event: ', data);
        },
      ),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AntiFraudController],
      providers: [
        {
          provide: AntiFraudService,
          useValue: antiFraudServiceMock,
        },
      ],
    }).compile();

    controller = module.get(AntiFraudController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should handle the transaction created event', () => {
    const event: TransactionCreatedEvent = new TransactionCreatedEvent(
      randomUUID(),
      800,
    );
    controller.handleTransactionCreated(event);
    expect(antiFraudServiceMock.handleTransactionCreated).toHaveBeenCalledTimes(
      1,
    );
  });
});
