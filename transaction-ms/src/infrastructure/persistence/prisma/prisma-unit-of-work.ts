import { Injectable } from '@nestjs/common';
import { type TransactionalContext, UnitOfWorkPort } from '../../../domain/ports/unit-of-work.port';
import { PrismaOutboxRepository } from './prisma-outbox.repository';
import { PrismaProcessedMessageRepository } from './prisma-processed-message.repository';
import { PrismaTransactionRepository } from './prisma-transaction.repository';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaUnitOfWork extends UnitOfWorkPort {
    constructor(private readonly prisma: PrismaService) {
        super();
    }

    run<T>(work: (ctx: TransactionalContext) => Promise<T>): Promise<T> {
        return this.prisma.$transaction(
            (tx) =>
                work({
                    transactions: new PrismaTransactionRepository(tx),
                    outbox: new PrismaOutboxRepository(tx),
                    processedMessages: new PrismaProcessedMessageRepository(tx),
                }),
            { timeout: 10_000 },
        );
    }
}