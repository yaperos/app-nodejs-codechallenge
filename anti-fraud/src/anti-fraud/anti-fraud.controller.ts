import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';
import { AntiFraudService } from './anti-fraud.service';

@Controller('anti-fraud')
export class AntiFraudController implements OnModuleInit { 
  constructor(
    private readonly antiFraudService: AntiFraudService,
    @Inject('ANTI_FRAUD_SERVICE') private client: ClientKafka
  ) {}

  onModuleInit() {
    this.client.subscribeToResponseOf('transactions_created');
  }

  @EventPattern('transactions_created')
  handler(@Payload() message: any): void {
    const transactionValidated = this.antiFraudService.validateTransaction(message.transactionEvent);
    this.client.emit('transactions_update', JSON.stringify({transactionValidated}));
  } 
}
