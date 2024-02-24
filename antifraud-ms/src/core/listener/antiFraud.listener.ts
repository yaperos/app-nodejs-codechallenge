import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionCreateDto } from 'src/common/dto/transactionCreateDto.dto';
import { AntifraudService } from 'src/core/service/antifraud.service';
import * as dotenv from 'dotenv';
dotenv.config();

@Controller()
export class AntiFraudListener {

  private readonly logger = new Logger(AntiFraudListener.name);

  constructor(private antifraudService: AntifraudService) {}

  @MessagePattern(process.env.ANTI_FRAUD_REVIEW_TOPIC) 
  review(@Payload() message: TransactionCreateDto) {
    this.logger.log('topic-antifraud-review - traceId:' + message.traceId + ', code received:'+ message.code);
    this.antifraudService.review(message);
  }
  
}
