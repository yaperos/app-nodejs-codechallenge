import { Controller, Post, Body, BadRequestException, Logger } from '@nestjs/common';
import { Ctx, KafkaContext, MessagePattern, Payload } from '@nestjs/microservices';

import { ValidateTransactionDto } from './dto/validate-transaction';
import { AntifraudService } from './antifraud.service';
import { config } from 'dotenv';

config();

@Controller('antifraud')
export class AntifraudController {
  private readonly logger = new Logger(AntifraudController.name);

  constructor(private readonly antifraudService: AntifraudService) {}

  @Post('validate')
  async validateTransaction(@Body() validateTransactionDto: ValidateTransactionDto) {
    try {

      const validationResponse = await this.antifraudService.validateTransaction(validateTransactionDto);

      return validationResponse;

    } catch (error) {

      throw new BadRequestException('Failed to validate transaction.');

    }
  }

  @MessagePattern(process.env.KAFKA_TRANSACTION_TOPIC)
  readMessage(@Payload() message: any, @Ctx() context: KafkaContext) {
    try {

      const originalMessage = context.getMessage();

      let transaction = JSON.parse(JSON.stringify(originalMessage.value));

      transaction.transactionStatus = this.antifraudService.validateTransaction({ value: transaction.value });

      this.antifraudService.sendTransactionUpdate(transaction);

    } catch (error) {

      this.logger.error(`Error occurred while processing message: ${error.message}`);
      
    }
  }
}



