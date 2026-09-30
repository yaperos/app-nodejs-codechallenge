import { Topics } from '@yape/contracts';
import { PoisonMessageError } from '../../application/errors/poison-message.error';
import type { EvaluateTransactionUseCase } from '../../application/evaluate-transaction/evaluate-transaction.use-case';
import type {
    ConsumedMessage,
    MessageConsumerPort,
    SubscribeOptions,
} from '../../application/ports/message-consumer.port';
import {
    TRANSACTION_CREATED_CONSUMER,
    TransactionCreatedConsumer,
} from './transaction-created.consumer';

const validEvent = {
    eventId: '33333333-3333-4333-8333-333333333333',
    eventType: 'transaction.created',
    version: 1,
    occurredAt: '2026-01-01T00:00:00.000Z',
    data: {
        transactionExternalId: '44444444-4444-4444-8444-444444444444',
        accountExternalIdDebit: '11111111-1111-4111-8111-111111111111',
        accountExternalIdCredit: '22222222-2222-4222-8222-222222222222',
        transferTypeId: 1,
        value: 120,
    },
};

const message = (value: string): ConsumedMessage => ({
    topic: Topics.TRANSACTION_CREATED,
    key: 'k',
    value,
    headers: {},
});

async function setup() {
    const subscribe = jest.fn().mockResolvedValue(undefined);
    const execute = jest.fn().mockResolvedValue(undefined);
    const consumer = new TransactionCreatedConsumer(
        { subscribe } as unknown as MessageConsumerPort,
        { execute } as unknown as EvaluateTransactionUseCase,
    );
    await consumer.onModuleInit();
    return { options: subscribe.mock.calls[0][0] as SubscribeOptions, execute };
}

describe('TransactionCreatedConsumer', () => {
    it('subscribes to the transaction.created topic', async () => {
        const { options } = await setup();
        expect(options.topic).toBe(Topics.TRANSACTION_CREATED);
        expect(options.groupId).toBe(TRANSACTION_CREATED_CONSUMER);
    });

    it('treats invalid JSON as a poison message', async () => {
        const { options, execute } = await setup();
        await expect(options.handler(message('nope'))).rejects.toBeInstanceOf(PoisonMessageError);
        expect(execute).not.toHaveBeenCalled();
    });

    it('treats a wrong schema as a poison message', async () => {
        const { options } = await setup();
        const invalid = JSON.stringify({ ...validEvent, data: { ...validEvent.data, value: -5 } });
        await expect(options.handler(message(invalid))).rejects.toBeInstanceOf(PoisonMessageError);
    });

    it('evaluates a valid event', async () => {
        const { options, execute } = await setup();

        await options.handler(message(JSON.stringify(validEvent)));

        expect(execute).toHaveBeenCalledWith(expect.objectContaining({ eventId: validEvent.eventId }));
    });
});