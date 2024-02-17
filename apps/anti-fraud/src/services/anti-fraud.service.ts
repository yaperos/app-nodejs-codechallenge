import { VERIFIED_TRANSACTION } from '@app/common/constants/anti-fraud-events';
import { TRANSACTION_BY_ANTI_FRAUD } from '@app/common/constants/service-names';
import { ValidateTransactionDto } from '@app/common/dtos/requests/validate-transaction.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionStatusEnum } from '@prisma/client';

@Injectable()
export class AntiFraudService {
  constructor(
    @Inject(TRANSACTION_BY_ANTI_FRAUD) private readonly client: ClientKafka,
  ) {}

  validateTransaction({ uuid, amount }: ValidateTransactionDto) {
    const status =
      amount > 1000
        ? TransactionStatusEnum.REJECTED
        : TransactionStatusEnum.APPROVED;

    this.client.emit(VERIFIED_TRANSACTION, { uuid, status });
  }
}
