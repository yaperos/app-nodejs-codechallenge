import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { msConfig } from '../../../infraestructure/config';
import { TransactionInterface } from 'src/domain/transaction/transaction.model';

@Injectable()
export class AntiFraudService {
  constructor(
    @Inject(msConfig.nameAntiFraud)
    private readonly antiFraudClient: ClientKafka,
  ) {}

  verifyTransaction(data: TransactionInterface): void {
    try {
      this.antiFraudClient.emit(
        `${msConfig.nameAntiFraud}-created-transaction`,
        JSON.stringify(data),
      );
    } catch (error) {
      console.log(error);
    }
  }
}
