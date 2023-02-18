import { HttpException, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { EitherAsync } from 'purify-ts';
import { EventClientService } from '../../../domain/services';

export class KafkaEventClientService implements EventClientService {
  constructor(
    @Inject('TRANSACTION_MICROSERVICE')
    private readonly client: ClientKafka,
  ) {}

  emitEvent<T>(topic: string, data: T): EitherAsync<HttpException, void> {
    return EitherAsync(async () => {
      try {
        this.client.emit(topic, data);
      } catch (error) {
        throw new HttpException(error, 500);
      }
    });
  }
}
