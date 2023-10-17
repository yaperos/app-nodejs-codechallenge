import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateTransactionRequestDto } from 'src/transactions/domain/dto/create-transaction-request.dto';
import { GenericResponseDto } from 'src/transactions/domain/dto/generic-response.dto';
import {
  Transaction,
  TransactionStatus,
} from 'src/transactions/domain/entity/transaction';
import { TransactionRepository } from 'src/transactions/domain/repository/transaction.repository';
import { CreateTransaction } from 'src/transactions/domain/use-case/create-transation';
import { ProcessRiskLevel } from 'src/transactions/domain/use-case/process-risk-level';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateTransactionImpl implements CreateTransaction {
  public constructor(
    @Inject('TRANSACTION_REPOSITORY')
    private readonly transactionRepository: TransactionRepository,
    @Inject('PROCESS_RISK_LEVEL')
    private readonly processRiskLevel: ProcessRiskLevel,
  ) {}

  public async execute(
    dto: CreateTransactionRequestDto,
  ): Promise<GenericResponseDto> {
    try {
      const riskLevel = await this.processRiskLevel.execute(dto);

      const transactionData: Partial<Transaction> = {
        transactionId: uuidv4(),
        accountExternalIdDebit: dto.accountExternalIdDebit,
        accountExternalIdCredit: dto.accountExternalIdCredit,
        channel: dto.channel,
        transferType: dto.transferType,
        amount: dto.value,
      };

      const transaction =
        await this.transactionRepository.createTransaction(transactionData);

      if (riskLevel < 0.3) {
        await this.transactionRepository.updateTransaction(
          transaction.transactionId,
          {
            status: TransactionStatus.APPROVED,
          },
        );
      }

      if (riskLevel >= 0.3 && riskLevel <= 0.8) {
        await this.transactionRepository.updateTransaction(
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
        await this.transactionRepository.updateTransaction(
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

      return GenericResponseDto.builder()
        .message('Transaction created successfully')
        .build();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
