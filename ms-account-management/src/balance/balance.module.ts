import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgreAccountBalance } from './infrastructure/entity/postgre-account-balance';
import { PostgreBalanceTransaction } from './infrastructure/entity/postgre-balance-transaction';
import { CreateAccountBalanceController } from './infrastructure/rest/create-account-balance.controller';
import { CreateAccountBalanceImpl } from './application/use-case/create-account-balance-impl';
import { PostgreAccountBalanceRepository } from './infrastructure/repository/postgre-account-balance.repository';
import { CreateBalanceTransactionController } from './infrastructure/rest/create-balance-transaction.controller';
import { PostgreBalanceTransactionRepository } from './infrastructure/repository/postgre-balance-transaction.repository';
import { CreateBalanceTransactionImpl } from './application/use-case/create-balance-transaction/create-balance-transaction-impl';
import { FindAccountBalanceByUserImpl } from './application/use-case/find-account-balance-by-user-impl';
import { UpdateAccountBalanceImpl } from './application/use-case/update-account-balance-impl';
import { BalanceTransactionContext } from './application/use-case/create-balance-transaction/balance-transaction.context';
import { FindAccountBalanceByUserController } from './infrastructure/rest/find-account-balance-by-user.controller';
import { FindAccountBalanceImpl } from './application/use-case/find-account-balance-impl';
import { FindAccountBalanceController } from './infrastructure/rest/find-account-balance.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostgreAccountBalance,
      PostgreBalanceTransaction,
    ]),
  ],
  controllers: [
    CreateAccountBalanceController,
    CreateBalanceTransactionController,
    FindAccountBalanceController,
    FindAccountBalanceByUserController,
  ],
  providers: [
    BalanceTransactionContext,
    {
      provide: 'ACCOUNT_BALANCE_REPOSITORY',
      useClass: PostgreAccountBalanceRepository,
    },
    {
      provide: 'BALANCE_TRANSACTION_REPOSITORY',
      useClass: PostgreBalanceTransactionRepository,
    },
    {
      provide: 'CREATE_ACCOUNT_BALANCE',
      useClass: CreateAccountBalanceImpl,
    },
    {
      provide: 'CREATE_BALANCE_TRANSACTION',
      useClass: CreateBalanceTransactionImpl,
    },
    {
      provide: 'FIND_ACCOUNT_BALANCE',
      useClass: FindAccountBalanceImpl,
    },
    {
      provide: 'FIND_ACCOUNT_BALANCE_BY_USER',
      useClass: FindAccountBalanceByUserImpl,
    },
    {
      provide: 'UPDATE_ACCOUNT_BALANCE',
      useClass: UpdateAccountBalanceImpl,
    },
  ],
})
export class BalanceModule {}
