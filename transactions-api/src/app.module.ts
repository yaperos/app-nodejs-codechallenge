import { Module } from '@nestjs/common';
import { TransactionModule } from './transaction/transaction.module';
import { KafkaModule } from './shared/kafka/kafka.module';
import { PrismaModule } from './shared/prisma/prisma.module';

@Module({
  imports: [TransactionModule, KafkaModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
