import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventBus } from '@nestjs/cqrs';
import { TransactionEventsController } from 'src/modules/transaction/infrastructure/controllers/transaction-events.controller';
import {
  IntegerMother,
  StringMother,
  WordMother,
} from 'tests/unit/modules/shared/domain/mothers';
import { TransactionCreatedEventMother } from 'tests/unit/modules/transaction/domain/mothers/transaction-created-event.mother';

describe('AntiFraudEvents controller', () => {
  let error;
  const config: Partial<ConfigService> = {
    get: jest.fn().mockReturnValue({}),
  };
  const eventBus: Partial<EventBus> = {
    publish: () => {
      throw error;
    },
  };
  const controller = new TransactionEventsController(
    config as ConfigService,
    eventBus as EventBus,
  );

  const loggerErrorSpy = jest
    .spyOn(Logger.prototype, 'error')
    .mockImplementation();

  const loggerLogSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();

  beforeEach(() => {
    jest.clearAllMocks();
    error = new Error(StringMother.random());
  });

  it('should catch error on handleTransactionCreated', async () => {
    const event = JSON.parse(
      JSON.stringify(TransactionCreatedEventMother.random()),
    );
    await controller['handleTransactionCreated'](event);

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      ...[error.message, error.stack, event],
    );
  });

  it('should catch error on handleKafkaMessage', async () => {
    const topic = WordMother.random();
    const partition = IntegerMother.random();
    const message = {
      offset: IntegerMother.random(),
    };
    controller['handleKafkaMessage']({ topic, partition, message });

    expect(loggerLogSpy).toHaveBeenCalledWith(
      `Message received: Topic - ${topic}, Partition - ${partition}, Offset - ${message.offset}`,
    );
    expect(loggerErrorSpy).toHaveBeenCalledTimes(1);
    expect(loggerErrorSpy.mock.calls[0][0]).toEqual(
      `No handler function found for topic: ${topic}`,
    );
  });
});
