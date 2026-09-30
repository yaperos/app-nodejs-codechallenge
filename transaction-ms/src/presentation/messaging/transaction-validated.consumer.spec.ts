import type { CommandBus } from '@nestjs/cqrs';
import { Topics } from '@yape/contracts';
import {
    STATUS_UPDATES_CONSUMER,
    UpdateTransactionStatusCommand,
} from '../../application/commands/update-transaction-status/update-transaction-status.command';
import { PoisonMessageError } from '../../application/errors/poison-message.error';
import type {
    ConsumedMessage,
    MessageConsumerPort,
    SubscribeOptions,
} from '../../application/ports/message-consumer.port';
import { TransactionValidatedConsumer } from './transaction-validated.consumer';

const validEvent = {
    eventId: '33333333-3333-4333-8333-333333333333',
    eventType: 'transaction.status-updated',
    version: 1,
    occurredAt: '2026-01-01T00:00:00.000Z',
    data: { transactionExternalId: '44444444-4444-4444-8444-444444444444', status: 'approved' },
};

const message = (value: string): ConsumedMessage => ({
    topic: Topics.TRANSACTION_STATUS_UPDATED,
    key: 'k',
    value,
    headers: {},
});

async function setup() {
    const subscribe = jest.fn().mockResolvedValue(undefined);
    const execute = jest.fn().mockResolvedValue(undefined);
    const consumer = new TransactionValidatedConsumer(
        { subscribe } as unknown as MessageConsumerPort,
        { execute } as unknown as CommandBus,
    );
    await consumer.onModuleInit();
    const options = subscribe.mock.calls[0][0] as SubscribeOptions;
    return { options, execute };
}

describe('TransactionValidatedConsumer', () => {
    it('subscribes to the status-updated topic', async () => {
        const { options } = await setup();
        expect(options.topic).toBe(Topics.TRANSACTION_STATUS_UPDATED);
        expect(options.groupId).toBe(STATUS_UPDATES_CONSUMER);
    });

    it('sends invalid JSON to the DLQ path as a poison message', async () => {
        const { options, execute } = await setup();
        await expect(options.handler(message('not json'))).rejects.toBeInstanceOf(PoisonMessageError);
        expect(execute).not.toHaveBeenCalled();
    });

    it('treats an event with a wrong schema as a poison message', async () => {
        const { options } = await setup();
        const invalid = JSON.stringify({ ...validEvent, data: { transactionExternalId: 'x', status: 'maybe' } });
        await expect(options.handler(message(invalid))).rejects.toBeInstanceOf(PoisonMessageError);
    });

    it('dispatches UpdateTransactionStatusCommand for a valid event', async () => {
        const { options, execute } = await setup();

        await options.handler(message(JSON.stringify(validEvent)));

        const command = execute.mock.calls[0][0] as UpdateTransactionStatusCommand;
        expect(command).toBeInstanceOf(UpdateTransactionStatusCommand);
        expect(command.transactionExternalId).toBe(validEvent.data.transactionExternalId);
        expect(command.status).toBe('approved');
        expect(command.eventId).toBe(validEvent.eventId);
    });
});