import { Controller, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { EventPattern, Payload } from '@nestjs/microservices';
import { DetectFraudDto } from './dto/detect-fraud.dto';

@Controller()
export class AppController {
  constructor(
    @Inject('TRANSACTION_MICROSERVICE')
    private readonly fraudDetectionClient: ClientKafka,
  ) {}

  @EventPattern('detect-fraud')
  async detectFraud(@Payload() detectFraudDto: DetectFraudDto) {
    for (let step = 0; step < 10; step++) {
      console.log('Fraud detection in progress...');
      await new Promise((r) => setTimeout(r, 1000));
    }
    const isFraud = detectFraudDto.transactionValue > 1000 ? 1 : 0;
    this.fraudDetectionClient.emit('transaction-update-fraud-status', {
      transactionId: detectFraudDto.transactionId,
      isFraud: isFraud,
    });
    console.log('Fraud detection done');
  }
}
