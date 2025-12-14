import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AntiFraudService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}
  
  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  handleTransactionValidation(data: any) {
    const { transactionExternalId, transactionValue } = data;
    const status = transactionValue > 1000 ? 'rejected' : 'approved';

    console.log(`Transaction ${transactionExternalId} with value ${transactionValue}. Status: ${status}`);

    const payload = {
      transactionExternalId,
      status,
    };

    this.kafkaClient.emit('transaction_status_updated', JSON.stringify(payload));
  }
}
