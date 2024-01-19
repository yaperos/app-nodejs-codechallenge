import { Logger } from '@nestjs/common';
import { UnhandledExceptionBus } from '@nestjs/cqrs';
import { ExceptionBusHandler } from 'src/modules/shared/infrastructure/exception-bus-handler';

import { IntegerMother, StringMother, UuidMother } from '../domain/mothers';
import { TestedDomainEvent } from '../domain/tested-domain.event';

describe('ExceptionBusHandler test', () => {
  let unhandledExceptionsBus: UnhandledExceptionBus;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let exceptionBusHandler: ExceptionBusHandler;
  const loggerErrorSpy = jest
    .spyOn(Logger.prototype, 'error')
    .mockImplementation();

  beforeEach(() => {
    unhandledExceptionsBus = new UnhandledExceptionBus();
    exceptionBusHandler = new ExceptionBusHandler(unhandledExceptionsBus);
  });

  it('should logger bus exception', async () => {
    const exception = new Error(StringMother.random());
    const event = new TestedDomainEvent({
      aggregateId: UuidMother.random(),
      fieldString: StringMother.random(),
      fieldInteger: IntegerMother.random(),
    });

    unhandledExceptionsBus.publish({ exception, cause: event });
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      ...[exception.message, exception.stack, JSON.stringify(event)],
    );
  });
});
