import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { AntifraudService } from './antifraud.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TOPIC_VALIDATION } from './constants/topic-validation.enum';
import { TransactionValidateDto } from './dto/transaction-validate.dto';

@Controller('antifraud')
export class AntifraudController {
  constructor(private readonly antifraudService: AntifraudService) {}

  @UsePipes(new ValidationPipe())
  @MessagePattern(TOPIC_VALIDATION.TRANSACTION_CREATED)
  public validateTransaction(@Payload() payload: TransactionValidateDto) {
    this.antifraudService.validateTransaction(payload);
  }
}
