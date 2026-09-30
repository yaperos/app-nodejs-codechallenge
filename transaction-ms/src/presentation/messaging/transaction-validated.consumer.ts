import { Injectable, type OnModuleInit } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Topics, TransactionStatusUpdatedEventSchema } from '@yape/contracts';
import {
    STATUS_UPDATES_CONSUMER,
    UpdateTransactionStatusCommand,
} from '../../application/commands/update-transaction-status/update-transaction-status.command';
import { PoisonMessageError } from '../../application/errors/poison-message.error';
import { type ConsumedMessage, MessageConsumerPort } from '../../application/ports/message-consumer.port';


@Injectable()
export class TransactionValidatedConsumer implements OnModuleInit {
    constructor(
        private readonly consumer: MessageConsumerPort,
        private readonly commandBus: CommandBus,
    ) { }

    async onModuleInit(): Promise<void> {
        await this.consumer.subscribe({
            groupId: STATUS_UPDATES_CONSUMER,
            topic: Topics.TRANSACTION_STATUS_UPDATED,
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

        const parsed = TransactionStatusUpdatedEventSchema.safeParse(json);
        if (!parsed.success) {
            throw new PoisonMessageError(`Invalid event schema: ${parsed.error.message}`);
        }

        const event = parsed.data;
        await this.commandBus.execute<UpdateTransactionStatusCommand, void>(
            new UpdateTransactionStatusCommand(
                event.data.transactionExternalId,
                event.data.status,
                event.eventId,
            ),
        );
    }
}