import { Injectable, type OnModuleInit } from '@nestjs/common';
import { Topics, TransactionCreatedEventSchema } from '@yape/contracts';
import { EvaluateTransactionUseCase } from '../../application/evaluate-transaction/evaluate-transaction.use-case';
import { PoisonMessageError } from '../../application/errors/poison-message.error';
import { type ConsumedMessage, MessageConsumerPort } from '../../application/ports/message-consumer.port';

export const TRANSACTION_CREATED_CONSUMER = 'anti-fraud-service.transaction-created';

@Injectable()
export class TransactionCreatedConsumer implements OnModuleInit {
    constructor(
        private readonly consumer: MessageConsumerPort,
        private readonly evaluateTransaction: EvaluateTransactionUseCase,
    ) { }

    async onModuleInit(): Promise<void> {
        await this.consumer.subscribe({
            groupId: TRANSACTION_CREATED_CONSUMER,
            topic: Topics.TRANSACTION_CREATED,
            handler: (message) => this.handle(message),
        });
    }

    private async handle(message: ConsumedMessage): Promise<void> {
        let json: unknown;
        try {
            json = JSON.parse(message.value);
        } catch {
            throw new PoisonMessageError('Message is not valid JSON');
        }

        const parsed = TransactionCreatedEventSchema.safeParse(json);
        if (!parsed.success) {
            throw new PoisonMessageError(`Invalid event schema: ${parsed.error.message}`);
        }

        await this.evaluateTransaction.execute(parsed.data);
    }
}