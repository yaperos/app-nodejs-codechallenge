import {
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaProducerService {
  constructor(
    @Inject('ANTIFRAUD_SERVICE')
    private kafkaClient: ClientKafka,
  ) {}

  async emit(
    topic: string,
    message: any,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log(
        `Emitting message to ${topic}:`,
        message,
      );
      this.kafkaClient
        .emit(topic, message)
        .subscribe({
          next: () => resolve(),
          error: (err) => {
            console.error(
              `Failed to emit message to ${topic}:`,
              err,
            );
            reject(
              new Error('Kafka emit failed'),
            );
          },
        });
    });
  }
}
