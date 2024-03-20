import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { AntiFraudService } from './anti-fraud.service';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionPayload } from './transaction-payload.dto';
import { lastValueFrom } from 'rxjs';

@Controller('anti-fraud')
export class AntiFraudController {
  private readonly logger = new Logger(AntiFraudController.name);

  constructor(
    private readonly antiFraudService: AntiFraudService,
    @Inject('ANTI_FRAUD_SERVICE')
    private kafkaService: ClientKafka,
  ) {}

  @Get()
  async all() {
    this.logger.log('All anti-fraud');
    return await this.antiFraudService.all();
  }

  @MessagePattern('transactions')
  async create(@Payload() message: TransactionPayload) {
    const antiFraud = await this.antiFraudService.create(message);
    await lastValueFrom(this.kafkaService.emit('anti-fraud', antiFraud));
    this.logger.log('Anti-fraud created', antiFraud.id);
    return antiFraud;
  }
}
