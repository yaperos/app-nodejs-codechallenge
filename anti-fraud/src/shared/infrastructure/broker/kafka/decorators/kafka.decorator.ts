import { applyDecorators, UseInterceptors, UsePipes } from '@nestjs/common';
import { MessagePattern, Transport } from '@nestjs/microservices';
import { BrokerLoggingInterceptor } from '../broker-logging.interceptor.ts.js';
import { KafkaValidationPipe } from '../pipes/kafka.validation.pipe.js';

export function MessageTopic(topic: string): any {
  return applyDecorators(
    MessagePattern(topic, Transport.KAFKA),
    UseInterceptors(BrokerLoggingInterceptor),
    UsePipes(KafkaValidationPipe),
  );
}
