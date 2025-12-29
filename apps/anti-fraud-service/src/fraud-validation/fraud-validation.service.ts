import { Injectable, Logger } from '@nestjs/common';

const MAX_ALLOWED_VALUE = 1000;

export enum TransactionValidationStatus {
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface TransactionCreatedEvent {
  transactionExternalId: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
  createdAt: Date;
}

export interface TransactionValidatedEvent {
  transactionExternalId: string;
  status: TransactionValidationStatus;
}

@Injectable()
export class FraudValidationService {
  private readonly logger = new Logger(FraudValidationService.name);

  validate(transaction: TransactionCreatedEvent): TransactionValidatedEvent {
    const { transactionExternalId, value } = transaction;

    this.logger.log(
      `Validating transaction ${transactionExternalId} with value: ${value}`,
    );

    // Business rule: transactions with value > 1000 are rejected
    const status =
      value > MAX_ALLOWED_VALUE
        ? TransactionValidationStatus.REJECTED
        : TransactionValidationStatus.APPROVED;

    this.logger.log(
      `Transaction ${transactionExternalId} validation result: ${status}`,
    );

    return {
      transactionExternalId,
      status,
    };
  }
}
