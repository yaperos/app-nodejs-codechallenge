import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateBalanceTransactionRequestDto } from 'src/balance/domain/dto/create-balance-transaction-request.dto';
import { GenericResponseDto } from 'src/balance/domain/dto/generic-response.dto';
import { BalanceTransactionRepository } from 'src/balance/domain/repository/balance-transaction.repository';
import { CreateBalanceTransaction } from 'src/balance/domain/use-case/create-balance-transaction';
import { selectStrategy } from './select-strategy';
import { BalanceTransactionContext } from './balance-transaction.context';
import {
  BalanceTransaction,
  TransactionType,
} from 'src/balance/domain/entity/balance-transaction';
import { UpdateAccountBalance } from 'src/balance/domain/use-case/update-account-balance';
import { FindAccountBalanceByUser } from 'src/balance/domain/use-case/find-account-balance-by-user';

@Injectable()
export class CreateBalanceTransactionImpl implements CreateBalanceTransaction {
  public constructor(
    @Inject('BALANCE_TRANSACTION_REPOSITORY')
    private readonly balanceTransactionRepository: BalanceTransactionRepository,
    private readonly context: BalanceTransactionContext,
    @Inject('FIND_ACCOUNT_BALANCE_BY_USER')
    private readonly findAccountBalanceByUser: FindAccountBalanceByUser,
    @Inject('UPDATE_ACCOUNT_BALANCE')
    private readonly updateAccountBalance: UpdateAccountBalance,
  ) {}

  public async execute(
    dto: CreateBalanceTransactionRequestDto,
  ): Promise<GenericResponseDto> {
    try {
      const accountBalance = await this.findAccountBalanceByUser.execute(
        dto.userId,
      );

      if (
        dto.transactionType === TransactionType.DEBIT &&
        accountBalance.amount < dto.amount
      ) {
        throw new InternalServerErrorException(
          'Insufficient funds to complete the transaction',
        );
      }

      const balanceTransaction: Partial<BalanceTransaction> = {
        accountBalanceId: dto.accountBalanceId,
        transactionType: dto.transactionType,
        description: dto.description,
        amount: dto.amount,
      };

      await this.balanceTransactionRepository.createBalanceTransaction(
        balanceTransaction,
      );

      const strategy = selectStrategy(dto.transactionType);
      this.context.setStrategy(strategy);
      const newAmount = this.context.execute(accountBalance.amount, dto.amount);

      this.updateAccountBalance.execute(dto.accountBalanceId, newAmount);

      return GenericResponseDto.builder()
        .message('Balance transaction created successfully')
        .build();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
