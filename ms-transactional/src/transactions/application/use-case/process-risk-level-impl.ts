import { Inject, Injectable } from '@nestjs/common';
import { getAntiFraudRules } from 'src/common/data/anti-fraud-rules';
import { CreateTransactionRequestDto } from 'src/transactions/domain/dto/create-transaction-request.dto';
import { TransactionRepository } from 'src/transactions/domain/repository/transaction.repository';
import { ProcessRiskLevel } from 'src/transactions/domain/use-case/process-risk-level';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

@Injectable()
export class ProcessRiskLevelImpl implements ProcessRiskLevel {
  public constructor(
    @Inject('TRANSACTION_REPOSITORY')
    private readonly transactionRepository: TransactionRepository,
  ) {}

  public async execute(
    transaction: CreateTransactionRequestDto,
  ): Promise<number> {
    const antiFraudRules = getAntiFraudRules();
    let riskLevel = 0;

    for (const rule of antiFraudRules) {
      if (rule.key === 'MAX_AMOUNT') {
        const maxAmount = parseFloat(rule.value);
        if (transaction.value > maxAmount) {
          riskLevel += rule.riskLevel;
        }
      }

      if (rule.key === 'TIME_BETWEEN_TRANSACTIONS') {
        const timeBetweenTransactions = parseInt(rule.value);
        const lastTransaction =
          await this.transactionRepository.findLastTransactionByAccountExternalIdDebit(
            transaction.accountExternalIdDebit,
          );

        if (lastTransaction) {
          const currentUtcDate = dayjs().utc();
          const lastTransactionDate = dayjs(lastTransaction.createdAt);
          const diff = currentUtcDate.diff(lastTransactionDate, 'second');

          if (diff < timeBetweenTransactions) {
            riskLevel += rule.riskLevel;
          }
        }
      }
    }

    return riskLevel;
  }
}
