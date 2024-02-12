import { Controller, Inject, Logger } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { AntiFraudMsService } from '../services/anti-fraud-ms.service';
import { AntiFraudResponse } from '../interfaces/anti-fraud-response';

@Controller()
export class AntiFraudMsController {
  constructor(
    @Inject('KAFKA_SERVICE') private kafka: ClientKafka,
    private antiFraudMsService: AntiFraudMsService,
  ) {}

  async onModuleInit() {
    Logger.log('Connecting to Kafka', AntiFraudMsController.name);
    await this.kafka.connect();
    Logger.log('Connected to Kafka', AntiFraudMsController.name);
  }

  @MessagePattern('transactions')
  getTransactions(@Payload() message) {
    const response: AntiFraudResponse =
      this.antiFraudMsService.validateTransaction(message);
    this.kafka.emit('anti-fraud-response', JSON.stringify(response));
  }
}
