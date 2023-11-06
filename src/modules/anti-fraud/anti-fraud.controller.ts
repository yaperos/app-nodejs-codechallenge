import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionService } from '../transaction/transaction.service';
import { MessageKafkaPayloadDto } from './dtos/message-kafka.dto';
import { AntiFraud } from './anti-fraud';

@Controller('anti-fraud')
export class AntiFraudController {
  constructor(
    private readonly provider: AntiFraud,
    private readonly transactionService: TransactionService,
  ) {}

  @MessagePattern('Anti-Fraud')
  public async messageTransaction(
    @Payload() payload: MessageKafkaPayloadDto[],
  ) {
    const response = await this.transactionService.updateTransaction(payload);
    Logger.log('Verified transactions', JSON.stringify(response));
    this.provider.emitMessage(response);
  }

  @MessagePattern('Transaction')
  public async transaction(@Payload() payload: MessageKafkaPayloadDto[]) {
    Logger.log('Transaction finish process', JSON.stringify(payload));
  }
}
