import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventBus } from '@nestjs/cqrs';
import { AntiFraudEventsController } from 'src/modules/transaction/infrastructure/controllers/antifraud-events.controller';
import {
  IntegerMother,
  StringMother,
  WordMother,
} from 'tests/unit/modules/shared/domain/mothers';
import { TransactionApprovedEventMother } from 'tests/unit/modules/transaction/domain/mothers/events/transaction-approved-event.mother';
import { TransactionRejectedEventMother } from 'tests/unit/modules/transaction/domain/mothers/events/transaction-rejected-event.mother';

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
  const controller = new AntiFraudEventsController(
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

  it('should catch error on handleTransactionApproved', async () => {
    const event = JSON.parse(
      JSON.stringify(TransactionApprovedEventMother.random()),
    );
    await controller['handleTransactionApproved'](event);

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      ...[error.message, error.stack, event],
    );
  });

  it('should catch error on handleTransactionRejected', async () => {
    const event = JSON.parse(
      JSON.stringify(TransactionRejectedEventMother.random()),
    );
    await controller['handleTransactionRejected'](event);

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
