import { Injectable } from '@nestjs/common';
import { ValidateAntiFraudDto } from './dto/validate-anti-fraud.dto';
import { TransactionService } from 'src/transaction/transaction.service';
import { TransactionStatusService } from 'src/transaction-status/transaction-status.service';

@Injectable()
export class TransactionValidationService {
  constructor(
    private transactionService: TransactionService,
    private transactionStatusService: TransactionStatusService,
  ) {}

  async validateTransaction(validateAntiFraudDto: ValidateAntiFraudDto) {
    const findStatus = await this.transactionStatusService.findOneByName(
      validateAntiFraudDto.status,
    );
    if (findStatus) {
      const transaction = await this.transactionService.findOneByTransactionId(
        validateAntiFraudDto.transactionExternalId,
      );
      transaction.transactionStatusId = findStatus.id;
      await this.transactionService.update(transaction.id, transaction);
    }
  }
}
