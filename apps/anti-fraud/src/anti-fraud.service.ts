import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AntiFraudService {

  constructor(
    @Inject('ANTI_FRAUD_SERVICE') private readonly client: ClientKafka
  ) {}

  
  handleTransactionCheck(data: any) {
    console.log('AntiFraudService.handleTransactionCheck.edit');
    const { value,transactionExternalId  } = data;
    let response = { id: transactionExternalId };
    if (value > 1000) {
      this.client.emit('anti-wrong', JSON.stringify(response) );
    } else {
      this.client.emit('anti-success', JSON.stringify(response));
    }
  }
}
