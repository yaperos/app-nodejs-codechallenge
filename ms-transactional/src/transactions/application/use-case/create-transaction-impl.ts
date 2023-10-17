import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateTransactionRequestDto } from 'src/transactions/domain/dto/create-transaction-request.dto';
import {
  Transaction,
  TransactionStatus,
} from 'src/transactions/domain/entity/transaction';
import { TransactionRepository } from 'src/transactions/domain/repository/transaction.repository';
import { CreateTransaction } from 'src/transactions/domain/use-case/create-transation';
import { ProcessRiskLevel } from 'src/transactions/domain/use-case/process-risk-level';

@Injectable()
export class CreateTransactionImpl implements CreateTransaction {
  public constructor(
    @Inject('TRANSACTION_REPOSITORY')
    private readonly transactionRepository: TransactionRepository,
    @Inject('PROCESS_RISK_LEVEL')
    private readonly processRiskLevel: ProcessRiskLevel,
  ) {}

  public async excute(dto: CreateTransactionRequestDto): Promise<Transaction> {
    try {
      let transaction = await this.transactionRepository.createTransaction(dto);

      const riskLevel = await this.processRiskLevel.execute(transaction);

      if (riskLevel < 0.3) {
        transaction = await this.transactionRepository.updateTransaction(
          transaction.transactionId,
          {
            status: TransactionStatus.APPROVED,
          },
        );
      }

      if (riskLevel >= 0.3 && riskLevel <= 0.8) {
        transaction = await this.transactionRepository.updateTransaction(
          transaction.transactionId,
          {
            status: TransactionStatus.REJECTED,
          },
        );
        // TODO: Send notification to user (Kakfa)
        // TODO: Send notification to anti-fraud team (Kakfa)

        throw new InternalServerErrorException(
          'Transaction rejected, please contact support',
        );
      }

      if (riskLevel >= 0.9) {
        transaction = await this.transactionRepository.updateTransaction(
          transaction.transactionId,
          {
            status: TransactionStatus.REJECTED,
          },
        );
        // TODO: Send notification to user (Kakfa)
        // TODO: Send notification to anti-fraud team (Kakfa)
        // TODO: Block user account (Kakfa)
        throw new InternalServerErrorException(
          'Transaction rejected and account blocked, please contact support',
        );
      }

      return transaction;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
