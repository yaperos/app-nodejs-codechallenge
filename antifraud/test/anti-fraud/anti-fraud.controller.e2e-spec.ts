import { AntiFraudController } from '../../src/anti-fraud/anti-fraud.controller';
import { Test } from '@nestjs/testing';
import { AntiFraudService } from '../../src/anti-fraud/anti-fraud.service';
import { providersMock } from '../mocks/providersMock';
import { EventsEnum } from 'shared-library-challenge/build/events/EventsEnum';
import { v4 as uuidv4 } from 'uuid';
import { TransactionApprovedEvent } from 'shared-library-challenge/build/events/TransactionApprovedEvent';
import { TransactionRejectedEvent } from 'shared-library-challenge/build/events/TransactionRejectedEvent';

const dateMock = new Date();

const transactionCreatedLessValue100 = {
  attributes: {
    topic: EventsEnum.transactionCreated,
    timestamp: new Date(),
  },
  data: {
    id_transaction: uuidv4(),
    value: 100,
  },
};
const transactionCreatedGraterValue1000 = {
  attributes: {
    topic: EventsEnum.transactionCreated,
    timestamp: new Date(),
  },
  data: {
    id_transaction: uuidv4(),
    value: 10000,
  },
};

describe('AntifraudController E2E', () => {
  let controller: AntiFraudController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      controllers: [AntiFraudController],
      providers: [AntiFraudService, ...providersMock()],
    }).compile();
    controller = module.get<AntiFraudController>(AntiFraudController);
  });
  it('Sould antifraud controller to be defined', () => {
    expect(controller).toBeDefined();
  });
  it('If transaction value is Less 1000 then aprove ,and emit event approved', () => {
    controller.transactionCreated(transactionCreatedLessValue100);
    expect(controller['eventBus'].emit).toHaveBeenCalledTimes(1);

    const transactioApprovedEvent = new TransactionApprovedEvent({
      id_transaction: transactionCreatedLessValue100.data.id_transaction,
    });
    transactioApprovedEvent.attributes.timestamp = expect.anything();
    expect(controller['eventBus'].emit).toHaveBeenCalledWith(
      transactioApprovedEvent,
    );
  });
  it('If transaction value is grater 1000 then reject ,and emit event rejected', () => {
    controller.transactionCreated(transactionCreatedGraterValue1000);
    expect(controller['eventBus'].emit).toHaveBeenCalledTimes(1);
    expect(controller['eventBus'].emit).toHaveBeenCalledWith(
      new TransactionRejectedEvent({
        id_transaction: transactionCreatedGraterValue1000.data.id_transaction,
      }),
    );
  });
});
