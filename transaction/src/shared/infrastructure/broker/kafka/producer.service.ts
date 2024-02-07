import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import {
  Message,
  Partitioners,
  RecordMetadata,
} from '@nestjs/microservices/external/kafka.interface';
import { catchError, lastValueFrom, map, of, timeout } from 'rxjs';
import { StringHelper } from 'src/shared/helper/string.helper';
import { ProducerService } from '../producer.service';
import { BrokerEventsName } from '../broker.enum';

@Injectable()
export class KafkaProducerService
  implements OnApplicationBootstrap, ProducerService
{
  private readonly timeout: number;
  protected logger = new Logger(KafkaProducerService.name);

  constructor(
    @Inject('KAFKA_SERVICE') private readonly clientKafka: ClientKafka,
    private readonly configService: ConfigService,
  ) {
    this.timeout = Number(
      this.configService.get<number>('kafka.producer_send_timeout'),
    );
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.clientKafka.connect();
    this.logger.log('Kafka Client Connected');
  }

  public emit<T extends object>(
    topic: BrokerEventsName,
    message: T,
  ): Promise<boolean> {
    const payload = this.buildPayload(message);
    return lastValueFrom(
      this.clientKafka.emit(topic, payload).pipe(
        timeout(this.timeout),
        map((result: RecordMetadata[]) => {
          if (result[0].errorCode != 0) return false;
          this.logger.log(`-> Sending message [${topic}]: ${payload.value}`);
          return true;
        }),
        catchError((e) => {
          this.logger.error('Error in kafka emit', e);
          return of(false);
        }),
      ),
    );
  }

  private buildPayload<T>(m: T) {
    const timestamp = new Date().getTime().toString();
    const message: Message = {
      key: StringHelper.generateUUID(),
      value: JSON.stringify(m),
      timestamp,
    };
    return message;
  }
}
