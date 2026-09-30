import type { Kafka } from 'kafkajs';
import { PoisonMessageError } from '../../application/errors/poison-message.error';
import type { SubscribeOptions } from '../../application/ports/message-consumer.port';
import { TransactionNotFoundError } from '../../domain/errors/domain.errors';
import type { DeadLetterPublisher } from './dead-letter.publisher';
import { KafkaMessageConsumer } from './kafka-message.consumer';

type EachMessage = (payload: { topic: string; message: unknown }) => Promise<void>;

async function setup(handler: SubscribeOptions['handler']) {
    let eachMessage!: EachMessage;
    const consumer = {
        connect: jest.fn().mockResolvedValue(undefined),
        subscribe: jest.fn().mockResolvedValue(undefined),
        run: jest.fn(async (config: { eachMessage: EachMessage }) => {
            eachMessage = config.eachMessage;
        }),
        disconnect: jest.fn().mockResolvedValue(undefined),
    };
    const kafka = { consumer: jest.fn().mockReturnValue(consumer) } as unknown as Kafka;
    const publish = jest.fn().mockResolvedValue(undefined);
    const topicInitializer = { ensureTopics: jest.fn().mockResolvedValue(undefined) };

    const adapter = new KafkaMessageConsumer(
        kafka,
        { publish } as unknown as DeadLetterPublisher,
        topicInitializer as any
    );

    await adapter.subscribe({ groupId: 'g', topic: 't', handler });

    const send = (value: string) =>
        eachMessage({
            topic: 't',
            message: { key: Buffer.from('k'), value: Buffer.from(value), headers: {} },
        });
    return { send, publish };
}

describe('KafkaMessageConsumer', () => {
    it('delivers the message to the handler', async () => {
        const handler = jest.fn().mockResolvedValue(undefined);
        const { send, publish } = await setup(handler);

        await send('payload');

        expect(handler).toHaveBeenCalledWith(
            expect.objectContaining({ topic: 't', key: 'k', value: 'payload' }),
        );
        expect(publish).not.toHaveBeenCalled();
    });

    it('sends poison messages straight to the DLQ without retrying', async () => {
        const handler = jest.fn().mockRejectedValue(new PoisonMessageError('bad json'));
        const { send, publish } = await setup(handler);

        await send('x');

        expect(handler).toHaveBeenCalledTimes(1);
        expect(publish).toHaveBeenCalledWith(expect.objectContaining({ consumerGroup: 'g' }));
    });

    it('does not retry domain errors', async () => {
        const handler = jest.fn().mockRejectedValue(new TransactionNotFoundError('id-1'));
        const { send, publish } = await setup(handler);

        await send('x');

        expect(handler).toHaveBeenCalledTimes(1);
        expect(publish).toHaveBeenCalledTimes(1);
    });

    it('retries transient failures and succeeds without touching the DLQ', async () => {
        const handler = jest
            .fn()
            .mockRejectedValueOnce(new Error('db down'))
            .mockResolvedValue(undefined);
        const { send, publish } = await setup(handler);

        await send('x');

        expect(handler).toHaveBeenCalledTimes(2);
        expect(publish).not.toHaveBeenCalled();
    });
});