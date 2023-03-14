import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { environment } from '@core/config/environment';
import { ValidateTransactionDto } from '@core/config/types';
import { TransactionValidateStatus } from '@core/config/constant';

@Injectable()
export class AntiFraudService {
  private readonly logger = new Logger(AntiFraudService.name);
  constructor(
    @Inject(environment.transactionKafkaConfig.name)
    private readonly transactionClient: ClientKafka,
  ) {}

  async validateTransaction(validateTransactionDto: ValidateTransactionDto) {
    try {
      this.logger.log({
        message: 'Validate transaction',
        validateTransactionDto,
      });

      const isValid = this.validateAmountValue(validateTransactionDto.value);

      this.logger.log(
        `transactionId ${validateTransactionDto.id} is ${isValid}`,
      );

      const emitPattern = isValid
        ? TransactionValidateStatus.APPROVED_TRANSACTION
        : TransactionValidateStatus.REJECTED_TRANSACTION;

      this.transactionClient.emit(
        emitPattern,
        JSON.stringify({
          transactionExternalId: validateTransactionDto.transactionExternalId,
          isValid,
        }),
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  private validateAmountValue(amount: number): boolean {
    return amount <= environment.transactionLimit;
  }
}
