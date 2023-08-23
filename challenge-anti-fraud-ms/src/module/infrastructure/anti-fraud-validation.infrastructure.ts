import { Inject, Injectable, Logger } from '@nestjs/common';
import { AntiFraudValidationRepository } from '../domain/repositories/anti-fraud-validation-repository';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionVerify } from '../domain/entities/transaction-verify';
import { Observable } from 'rxjs';
import {
  ClientModuleRegister,
  MinPassRate,
  TransactionStatusVerify,
} from 'src/core/helpers/constants';
@Injectable()
export class AntiFraudValidationInfrastructure
  implements AntiFraudValidationRepository
{
  constructor(
    @Inject(ClientModuleRegister)
    private readonly clientKafka: ClientKafka,
    private readonly logger: Logger,
  ) {}

  async getVerifyTransaction<T>(
    transaction: TransactionVerify,
  ): Promise<Observable<T>> {
    const { transactionExternalId, value } = transaction;
    const status =
      value > MinPassRate
        ? TransactionStatusVerify.REJECTED
        : TransactionStatusVerify.APPROVED;

    this.logger.log(`status to be updated is ${status} with value ${value}`);
    return this.clientKafka.emit(
      process.env.CLIENT_TRANSACTION_VERIFY_MS,
      JSON.stringify({ transactionExternalId, status }),
    );
  }
}
