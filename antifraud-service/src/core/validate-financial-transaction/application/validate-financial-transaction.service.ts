import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Topics } from '../../../shared/infrastructure/topics';
import { FinancialTransactionStatusEnum } from '../domain/financial-transaction-status.enum';
import { FinancialTransactionValidatedEvent } from '../domain/financial-transaction-validated.event';
import { ValidateFinancialTransactionRequestDTO } from '../infrastructure/dto/validate-financial-transaction-status-request.dto';

@Injectable()
export class ValidateFinancialTransactionService {
  constructor(
    @Inject('FINANCIAL_TRANSACTION_SERVICE')
    private readonly financialTransactionService: ClientKafka,
  ) {}

  async handle(
    validateFinancialTransactionRequestDTO: ValidateFinancialTransactionRequestDTO,
  ): Promise<void> {
    // TODO: Perform antifraud validation logic here
    const randomBoolean =
      validateFinancialTransactionRequestDTO.value.value % 2 === 0;

    const financialTransactionStatus = randomBoolean
      ? FinancialTransactionStatusEnum.Approved
      : FinancialTransactionStatusEnum.Rejected;

    const financialTransactionValidatedEvent =
      new FinancialTransactionValidatedEvent(
        validateFinancialTransactionRequestDTO.id.value,
        financialTransactionStatus,
      );

    this.financialTransactionService.emit(
      financialTransactionStatus
        ? Topics.FinancialTransactionApprovedTopic
        : Topics.FinancialTransactionRejectedTopic,
      financialTransactionValidatedEvent.toString(),
    );
  }
}
