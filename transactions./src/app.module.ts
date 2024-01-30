import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from './user/user.module';
import { BalanceModule } from './balance/balance.module';
import { PrismaModule } from './prisma/prisma.module';
import { TransactionModule } from './transaction/transaction.module';
import { TransactionTypeModule } from './transactionType/transactionType.module';
import { StatusTransactionModule } from './statusTransaction/statusTransaction.module';
import { KafkaModule } from './core/kafka/kafka.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    KafkaModule,
    UserModule,
    BalanceModule,
    PrismaModule,
    TransactionModule,
    TransactionTypeModule,
    StatusTransactionModule,
  ],
})
export class AppModule {}
