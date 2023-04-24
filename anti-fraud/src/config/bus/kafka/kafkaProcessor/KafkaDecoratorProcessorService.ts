import { Injectable } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { LoggerService } from "../../../logger/logger.service";
import { ConfigService } from "@nestjs/config";
import { KAFKA_TOPIC_METADATA } from "../../../decorator/KafkaTopic";

@Injectable()
export class KafkaDecoratorProcessorService {

  constructor(
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
  ) {
  }

  async processKafkaDecorators(types: any[]) {
    for (const type of types) {
      const propNames = Object.getOwnPropertyNames(type.prototype);
      for (const prop of propNames) {
        const propValue = Reflect.getMetadata(
          KAFKA_TOPIC_METADATA,
          Reflect.get(type.prototype, prop),
        );

        if (propValue) {
          const topic = await this.configService.get('TRANSACTION_KAFKA_TOPIC');
          this.logger.log(`Setting topic ${topic} for ${type.name}#${prop}`);
          Reflect.decorate(
            [MessagePattern(topic)],
            type.prototype,
            prop,
            Reflect.getOwnPropertyDescriptor(type.prototype, prop),
          );
        }
      }
    }
  }
}
