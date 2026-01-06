import type { RequestContext } from '@app/common';
import { LoggerService } from '@app/observability';
import { Transaction } from '@domain/entities/transaction.entity';
import {
    type ITransactionRepository,
    TRANSACTION_REPOSITORY,
} from '@domain/repositories/transaction.repository.interface';
import { TransactionStatus } from '@domain/value-objects/transaction-status.vo';
import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import type { ICreateTransactionUseCase } from '../../domain/ports/input/create-transaction.use-case.interface';
import { EVENT_PUBLISHER, type IEventPublisher } from '../../domain/ports/output/event-publisher.interface';

export interface CreateTransactionDto {
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    tranferTypeId: number;
    value: number;
}

@Injectable()
export class CreateTransactionUseCase implements ICreateTransactionUseCase {
    constructor(
        @Inject(TRANSACTION_REPOSITORY)
        private readonly transactionRepository: ITransactionRepository,
        @Inject(EVENT_PUBLISHER)
        private readonly eventPublisher: IEventPublisher,
        private readonly logger: LoggerService,
    ) {}

    async execute(dto: CreateTransactionDto, context?: Partial<RequestContext>): Promise<Transaction> {
        this.logger.log('Creating transaction', context, { dto });
        const transactionExternalId = uuidv4();

        const transaction = new Transaction(
            transactionExternalId,
            dto.accountExternalIdDebit,
            dto.accountExternalIdCredit,
            dto.tranferTypeId,
            dto.value,
            TransactionStatus.PENDING,
            new Date(),
        );

        const savedTransaction = await this.transactionRepository.save(transaction);

        await this.eventPublisher.publishTransactionCreated(
            {
                transactionExternalId: savedTransaction.transactionExternalId,
                accountExternalIdDebit: savedTransaction.accountExternalIdDebit,
                accountExternalIdCredit: savedTransaction.accountExternalIdCredit,
                transferTypeId: savedTransaction.transferTypeId,
                value: savedTransaction.value,
                transactionStatus: savedTransaction.transactionStatus,
                createdAt: savedTransaction.createdAt,
            },
            context,
        );

        this.logger.log(`Transaction created: ${savedTransaction.transactionExternalId}`, context, {
            transactionId: savedTransaction.transactionExternalId,
            value: savedTransaction.value,
        });

        return savedTransaction;
    }
}
