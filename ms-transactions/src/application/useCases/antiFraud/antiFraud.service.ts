import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { msConfig } from '../../../infraestructure/config';
import { TransactionInterface } from '../../../domain/transaction/createTransaction/transaction.model';
import { AntiFraudServiceInterface } from 'src/domain/antiFraud/antiFraud.interface';

@Injectable()
export class AntiFraudService implements AntiFraudServiceInterface {
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
