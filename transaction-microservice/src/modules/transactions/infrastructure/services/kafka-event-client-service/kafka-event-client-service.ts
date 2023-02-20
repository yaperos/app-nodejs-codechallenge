import { HttpException, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { env } from 'process';
import { Either } from 'purify-ts';
import { EventClientService } from '../../../domain/services';

export class KafkaEventClientService implements EventClientService {
  constructor(
    @Inject(env.KAFKA_NAME_MODULE)
    private readonly client: ClientKafka,
  ) {}

  emitEvent<T>(topic: string, data: T): Either<HttpException, void> {
    return Either.encase(() => {
      try {
        this.client.emit(topic, JSON.stringify(data));
      } catch (error: any) {
        throw new HttpException(error, 500);
      }
    });
  }
}
