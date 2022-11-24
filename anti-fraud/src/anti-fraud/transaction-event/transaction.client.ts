import { ClientKafka } from '@nestjs/microservices';
import { Inject, Injectable } from "@nestjs/common";
import { AntiFraudResponseDto } from '../dto/anti-fraud-response.dto';

@Injectable()
export class TransactionClient {
  constructor(
    @Inject('transaction-client')
    private readonly clientKafka: ClientKafka,
  ) {}

  public sendResponseAntiFraud(antiFraudResponse: AntiFraudResponseDto) {
    console.log(antiFraudResponse);
    this.clientKafka.emit(
      'response-anti-fraud',
      JSON.stringify(antiFraudResponse),
    );
  }
}
