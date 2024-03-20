import { Module } from '@nestjs/common';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { ExceptionsModule } from '../services/exceptions/exceptions.module';
import { LoggerModule } from '../services/logger/logger.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaTransactionRepository } from './prisma/repositories/prisma-transaction.repository';

@Module({
  imports: [ExceptionsModule, LoggerModule],
  providers: [
    PrismaService,
    {
      provide: TransactionRepository,
      useClass: PrismaTransactionRepository,
    },
  ],
  exports: [
    {
      provide: TransactionRepository,
      useClass: PrismaTransactionRepository,
    },
    ExceptionsModule,
    LoggerModule,
  ],
})
export class DatabaseModule {}
