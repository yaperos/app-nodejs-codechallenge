import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { KafkaService } from './kafka.service';
import { KAFKA_TOPICS } from 'src/constants/kafka.constants';
import { TransactionDto } from 'src/dtos/transaction.dto';

@Controller()
export class KafkaController {
  constructor(private kafkaService: KafkaService) {}

  @MessagePattern(KAFKA_TOPICS.TransactionStatusUpdated)
  async handleTransactionStatusUpdated(@Payload() transaction: TransactionDto) {
    await this.kafkaService.handleTransactionStatusUpdated(transaction);
  }
}
