import { Module, ValidationPipe } from '@nestjs/common';
import { TransactionModule } from './transaction/transaction.module';
import { KafkaModule } from './shared/kafka/kafka.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [TransactionModule, KafkaModule, PrismaModule],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {}
