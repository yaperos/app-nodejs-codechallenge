import { Module } from '@nestjs/common';
import { PrismaTransactionRepository } from './prisma-transaction.repository';
import { PrismaOutboxRepository } from './prisma-outbox.repository';
import { TRANSACTION_REPOSITORY, OUTBOX_REPOSITORY } from '@ports/tokens';
import { PrismaService } from '@infra/prisma/prisma.service';

@Module({
  providers: [
    PrismaService,
    PrismaTransactionRepository,
    PrismaOutboxRepository,
    {
      provide: TRANSACTION_REPOSITORY,
      useExisting: PrismaTransactionRepository,
    },
    {
      provide: OUTBOX_REPOSITORY,
      useExisting: PrismaOutboxRepository,
    },
  ],
  exports: [TRANSACTION_REPOSITORY, OUTBOX_REPOSITORY],
})
export class PersistenceModule {}
