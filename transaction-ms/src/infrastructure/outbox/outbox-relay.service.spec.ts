import type { ConfigService } from '@nestjs/config';
import type { Env } from '../../config/env';
import type { KafkaProducer } from '../messaging/kafka.producer';
import type { PrismaService } from '../persistence/prisma/prisma.service';
import { OutboxRelayService } from './outbox-relay.service';

const config = {
    get: (key: string) =>
        ({ OUTBOX_POLL_INTERVAL_MS: 1000, OUTBOX_BATCH_SIZE: 100 })[key as 'OUTBOX_BATCH_SIZE'],
} as unknown as ConfigService<Env, true>;

const row = {
    id: 'row-1',
    eventId: 'evt-1',
    topic: 'transaction.created',
    key: 'tx-1',
    payload: { hello: 'world' },
};

function setup(rows: unknown[], kafkaFails = false) {
    const updateMany = jest.fn().mockResolvedValue({ count: rows.length });
    const tx = { $queryRaw: jest.fn().mockResolvedValue(rows), outboxEvent: { updateMany } };
    const prisma = {
        $transaction: (work: (client: unknown) => Promise<unknown>) => work(tx),
    } as unknown as PrismaService;
    const sendMany = kafkaFails
        ? jest.fn().mockRejectedValue(new Error('kafka down'))
        : jest.fn().mockResolvedValue(undefined);

    const service = new OutboxRelayService(prisma, { sendMany } as unknown as KafkaProducer, config);
    const relayBatch = () =>
        (service as unknown as { relayBatch: () => Promise<number> }).relayBatch();

    return { relayBatch, sendMany, updateMany };
}

describe('OutboxRelayService', () => {
    it('publishes pending events and marks them as SENT', async () => {
        const { relayBatch, sendMany, updateMany } = setup([row]);

        await expect(relayBatch()).resolves.toBe(1);

        expect(sendMany).toHaveBeenCalledWith([
            {
                topic: 'transaction.created',
                key: 'tx-1',
                value: JSON.stringify({ hello: 'world' }),
                headers: { 'event-id': 'evt-1', 'content-type': 'application/json' },
            },
        ]);
        expect(updateMany).toHaveBeenCalledWith({
            where: { id: { in: ['row-1'] } },
            data: { status: 'SENT', sentAt: expect.any(Date) },
        });
    });

    it('does nothing when there are no pending events', async () => {
        const { relayBatch, sendMany, updateMany } = setup([]);

        await expect(relayBatch()).resolves.toBe(0);

        expect(sendMany).not.toHaveBeenCalled();
        expect(updateMany).not.toHaveBeenCalled();
    });

    it('does not mark events as SENT when Kafka fails', async () => {
        const { relayBatch, updateMany } = setup([row], true);

        await expect(relayBatch()).rejects.toThrow('kafka down');

        expect(updateMany).not.toHaveBeenCalled();
    });
});