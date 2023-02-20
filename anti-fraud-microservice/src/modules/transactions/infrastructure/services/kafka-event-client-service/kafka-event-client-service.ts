import { HttpException, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Either } from 'purify-ts';
import { EventClientService } from '../../../domain/services';

export class KafkaEventClientService implements EventClientService {
  constructor(
    @Inject('ANTI-FRAUD-MICROSERVICE')
    private readonly client: ClientKafka,
  ) {}

  emitEvent<T>(topic: string, data: T): Either<HttpException, void> {
    return Either.encase(() => {
      try {
        this.client.emit(topic, JSON.stringify(data));
      } catch (error) {
        console.log(error);
        throw new HttpException(error, 500);
      }
    });
  }
}
