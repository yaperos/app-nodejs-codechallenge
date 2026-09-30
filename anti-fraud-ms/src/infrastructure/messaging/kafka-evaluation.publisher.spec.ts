import { Topics, TransactionStatusUpdatedEventSchema } from '@yape/contracts';
import type { FraudEvaluation } from '../../domain/models/fraud-evaluation';
import { KafkaEvaluationPublisher } from './kafka-evaluation.publisher';
import type { KafkaProducer } from './kafka.producer';

const evaluation = (
    status: 'approved' | 'rejected',
    reasons: string[] = [],
    sourceEventId = '33333333-3333-4333-8333-333333333333',
): FraudEvaluation => ({
    sourceEventId,
    transactionId: '44444444-4444-4444-8444-444444444444',
    status,
    reasons,
});

async function publish(input: FraudEvaluation) {
    const send = jest.fn().mockResolvedValue(undefined);
    await new KafkaEvaluationPublisher({ send } as unknown as KafkaProducer).publish(input);
    const message = send.mock.calls[0][0] as { topic: string; key: string; value: string };
    const event = JSON.parse(message.value) as {
        eventId: string;
        data: { status: string; reason?: string };
    };
    return { message, event };
}

describe('KafkaEvaluationPublisher', () => {
    it('publishes an approved result that honours the contract', async () => {
        const { message, event } = await publish(evaluation('approved'));

        expect(message.topic).toBe(Topics.TRANSACTION_STATUS_UPDATED);
        expect(message.key).toBe('44444444-4444-4444-8444-444444444444');
        expect(TransactionStatusUpdatedEventSchema.safeParse(event).success).toBe(true);
        expect(event.data.status).toBe('approved');
        expect(event.data.reason).toBeUndefined();
    });

    it('joins the rejection reasons', async () => {
        const { event } = await publish(evaluation('rejected', ['too high', 'suspicious']));

        expect(event.data.status).toBe('rejected');
        expect(event.data.reason).toBe('too high; suspicious');
    });

    it('derives a deterministic eventId from the source event', async () => {
        const first = await publish(evaluation('approved'));
        const again = await publish(evaluation('approved'));
        const other = await publish(evaluation('approved', [], '55555555-5555-4555-8555-555555555555'));

        expect(again.event.eventId).toBe(first.event.eventId);
        expect(other.event.eventId).not.toBe(first.event.eventId);
    });
});