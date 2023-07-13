import { Controller, Logger } from '@nestjs/common';
import { KAFKA_TOPIC_ANTIFRAUD_VALIDATION } from './app/kafka';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionMessageDto } from './dto/transaction.message';
import { TransactionMessageResponse } from './dto/transaction.response';

@Controller()
export class AppController {
  @MessagePattern(KAFKA_TOPIC_ANTIFRAUD_VALIDATION)
  async infoTransaction(@Payload() dto: TransactionMessageDto): Promise<any> {
    const { id, value } = dto;
    const response: TransactionMessageResponse = {
      id,
      status: value > 1000 ? 'REJECTED' : 'APPROVED',
    };
    return response;
  }
}
