import { Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { KafkaBrokerProvider } from 'src/modules/shared/infrastructure/providers/kafka-broker.provider';

import { IntegerMother, StringMother, UuidMother } from '../../domain/mothers';
import { TestedDomainEvent } from '../../domain/tested-domain.event';

describe('KafkaBrokerProvider test', () => {
  const event = new TestedDomainEvent({
    aggregateId: UuidMother.random(),
    fieldString: StringMother.random(),
    fieldInteger: IntegerMother.random(),
  });
  const loggerLogSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
  const loggerErrorSpy = jest
    .spyOn(Logger.prototype, 'error')
    .mockImplementation();

  it('should logger on publish event success', async () => {
    const clientKafka: Partial<ClientKafka> = {
      emit: jest.fn().mockReturnValue(
        new Observable<void>((observer) => {
          observer.next();
          observer.complete();
        }),
      ),
    };
    const kafkaBrokerProvider = new KafkaBrokerProvider(
      clientKafka as ClientKafka,
    );
    await kafkaBrokerProvider.publishEvent(event);

    const data = JSON.stringify(event);
    expect(loggerLogSpy).toHaveBeenCalledWith(`Message sent: ${data}`);
    expect(clientKafka.emit).toHaveBeenCalledWith(...[event.eventName, data]);
  });

  it('should logger on publish event failed', async () => {
    const error = new Error('Error in kafka provider connect');
    const clientKafka: Partial<ClientKafka> = {
      emit: jest.fn().mockReturnValue(
        new Observable<void>((observer) => {
          observer.error(error);
        }),
      ),
    };
    const kafkaBrokerProvider = new KafkaBrokerProvider(
      clientKafka as ClientKafka,
    );
    await kafkaBrokerProvider.publishEvent(event);

    const data = JSON.stringify(event);
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      ...[error.message, error.stack, event],
    );
    expect(clientKafka.emit).toHaveBeenCalledWith(...[event.eventName, data]);
  });
});
