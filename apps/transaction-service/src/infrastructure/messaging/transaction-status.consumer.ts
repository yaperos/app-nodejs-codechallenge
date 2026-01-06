import { KafkaConsumerService, KafkaTopics, TransactionStatus, type TransactionStatusUpdatedEvent } from '@app/common';
import { LoggerService } from '@app/observability';
import { Inject, Injectable, type OnModuleInit } from '@nestjs/common';
import type { EachMessagePayload } from 'kafkajs';
import {
    type IUpdateTransactionStatusUseCase,
    UPDATE_TRANSACTION_STATUS_USE_CASE,
} from '../../domain/ports/input/update-transaction-status.use-case.interface';

@Injectable()
export class TransactionStatusConsumer implements OnModuleInit {
    constructor(
        private readonly kafkaConsumer: KafkaConsumerService,
        @Inject(UPDATE_TRANSACTION_STATUS_USE_CASE)
        private readonly updateTransactionStatusUseCase: IUpdateTransactionStatusUseCase,
        private readonly logger: LoggerService,
    ) {}

    async onModuleInit() {
        this.kafkaConsumer.registerHandler(KafkaTopics.TRANSACTION_APPROVED, this.handleApproved.bind(this));

        this.kafkaConsumer.registerHandler(KafkaTopics.TRANSACTION_REJECTED, this.handleRejected.bind(this));

        await this.kafkaConsumer.subscribeAndRun([KafkaTopics.TRANSACTION_APPROVED, KafkaTopics.TRANSACTION_REJECTED]);
    }

    private async handleApproved(payload: EachMessagePayload): Promise<void> {
        if (!payload.message.value) {
            console.error('Received message with null value');
            return;
        }
        const event: TransactionStatusUpdatedEvent = JSON.parse(payload.message.value.toString());

        const requestContext = {
            correlationId: event.metadata.correlationId,
            requestId: event.metadata.causationId,
        };

        this.logger.log(`Received transaction-approved: ${event.transactionExternalId}`, requestContext);

        await this.updateTransactionStatusUseCase.execute(event.transactionExternalId, TransactionStatus.APPROVED);

        this.logger.log(`Transaction ${event.transactionExternalId} marked as approved`, requestContext);
    }

    private async handleRejected(payload: EachMessagePayload): Promise<void> {
        if (!payload.message.value) {
            console.error('Received message with null value');
            return;
        }
        const event: TransactionStatusUpdatedEvent = JSON.parse(payload.message.value.toString());

        const requestContext = {
            correlationId: event.metadata.correlationId,
            requestId: event.metadata.causationId,
        };

        this.logger.log(`Received transaction-rejected: ${event.transactionExternalId}`, requestContext);

        await this.updateTransactionStatusUseCase.execute(event.transactionExternalId, TransactionStatus.REJECTED);

        this.logger.log(`Transaction ${event.transactionExternalId} marked as rejected`, requestContext);
    }
}
