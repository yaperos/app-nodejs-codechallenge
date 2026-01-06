import { KafkaConsumerService, KafkaTopics, type TransactionCreatedEvent } from '@app/common';
import { Inject, Injectable, type OnModuleInit } from '@nestjs/common';
import type { EachMessagePayload } from 'kafkajs';
import {
    type IValidateTransactionUseCase,
    VALIDATE_TRANSACTION_USE_CASE,
} from '../../domain/ports/input/validate-transaction.use-case.interface';

@Injectable()
export class TransactionCreatedConsumer implements OnModuleInit {
    constructor(
        private readonly kafkaConsumer: KafkaConsumerService,
        @Inject(VALIDATE_TRANSACTION_USE_CASE)
        private readonly validateTransactionUseCase: IValidateTransactionUseCase,
    ) {}

    async onModuleInit() {
        this.kafkaConsumer.registerHandler(KafkaTopics.TRANSACTION_CREATED, this.handleTransactionCreated.bind(this));

        await this.kafkaConsumer.subscribeAndRun([KafkaTopics.TRANSACTION_CREATED]);
    }

    private async handleTransactionCreated(payload: EachMessagePayload) {
        const { message } = payload;
        if (!message.value) {
            console.error('Received message with null value');
            return;
        }
        const transaction: TransactionCreatedEvent = JSON.parse(message.value.toString());

        await this.validateTransactionUseCase.execute(
            transaction.transactionExternalId,
            transaction.value,
            transaction.accountExternalIdDebit,
            transaction.accountExternalIdCredit,
            transaction.transferTypeId,
            new Date(transaction.createdAt),
            transaction.metadata,
        );
    }
}
