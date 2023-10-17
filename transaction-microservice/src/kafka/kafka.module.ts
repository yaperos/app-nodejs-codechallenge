import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer/consumer.service';
import { ProducerService } from './producer/producer.service';

@Module({
  providers: [ConsumerService, ProducerService],
  // Exporto los servicios para usar en los otros módulos
  exports:[ConsumerService, ProducerService]
})
export class KafkaModule {}
