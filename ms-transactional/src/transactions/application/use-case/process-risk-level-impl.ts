import { Inject, Injectable } from '@nestjs/common';
import { getAntiFraudRules } from 'src/common/data/anti-fraud-rules';
import { Transaction } from 'src/transactions/domain/entity/transaction';
import { TransactionRepository } from 'src/transactions/domain/repository/transaction.repository';
import { ProcessRiskLevel } from 'src/transactions/domain/use-case/process-risk-level';

@Injectable()
export class ProcessRiskLevelImpl implements ProcessRiskLevel {
  public constructor(
    @Inject('TRANSACTION_REPOSITORY')
    private readonly transactionRepository: TransactionRepository,
  ) {}

  public async execute(transaction: Transaction): Promise<number> {
    const antiFraudRules = getAntiFraudRules();
    let riskLevel = 0;

    for (const rule of antiFraudRules) {
      if (rule.key === 'MAX_AMOUNT') {
        const maxAmount = parseFloat(rule.value);
        if (transaction.amount > maxAmount) {
          riskLevel += rule.riskLevel;
        }
      }

      if (rule.key === 'TIME_BETWEEN_TRANSACTIONS') {
        const timeBetweenTransactions = parseInt(rule.value);
        const lastTransaction =
          await this.transactionRepository.findLastTransactionByAccountExternalIdDebit(
            transaction.accountExternalIdDebit,
          );
        const timeDiff = Math.abs(
          transaction.createdAt.getTime() - lastTransaction.createdAt.getTime(),
        );
        const diffSeconds = Math.ceil(timeDiff / (1000 * 60));
        if (diffSeconds < timeBetweenTransactions) {
          riskLevel += rule.riskLevel;
        }
      }

      continue;
    }

    return riskLevel;
  }
}
