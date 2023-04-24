import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { EventDomain } from '../event.domain';
import { EventBus } from '../event.bus';
import { TopicError } from './topic.error';
import { LoggerService } from '../../logger/logger.service';
import { TracerService } from '../../tracer/tracer.service';

@Injectable()
export class KafkaService extends EventBus {
  constructor(
    @Inject('KAFKA_SERVICE') private client: ClientProxy,
    protected configService: ConfigService,
    private readonly logger: LoggerService,
    private readonly tracer: TracerService,
  ) {
    super();
  }

  async emit(event: EventDomain): Promise<object> {
    const topic = await this.getTopicName(event);
    const data = event.getData();
    const attributes = { ...event.getAttributes() };

    const kafkaResponse = await firstValueFrom(
      this.client.emit(topic, {
        value: data,
        headers: attributes,
      }),
    );

    this.logger.log(
      {
        layer: 'KafkaService',
        function: 'create',
        commerce: attributes?.commerce,
        entityId: attributes?.entityId,
        kafkaMessage: {
          metadata: attributes,
          data: data,
        },
        kafkaResponse,

      },
      `eventId: ${this.tracer.getTrace()}, Kafka Response`,
    );

    return {
      data: data,
      metadata: attributes,
    };
  }

  private async getTopicName(event: EventDomain): Promise<string> {
    const topicName: string = await this.configService.get(event.topic);

    if (!topicName || topicName === '') {
      throw new TopicError(event.topic);
    }

    return topicName;
  }
}
