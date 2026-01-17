import { prisma } from "../db/prisma";
import { logger } from "../utils/logger";
import { createKafka, createProducer, safePublish } from "@yape/kafka/src";
import { TOPICS } from "./topics";
import { config } from "../config";

function backoffMs(attempt: number) {
    const seq = [1000, 5000, 30000, 120000, 300000];
    return seq[Math.min(attempt, seq.length - 1)];
}

export async function startOutboxPublisher() {
    const kafka = createKafka({ clientId: "transaction-service", brokers: config.kafkaBrokers });
    const producer = await createProducer(kafka);

    const interval = setInterval(async () => {
        try {
            const now = new Date();

            const batch = await prisma.outboxEvent.findMany({
                where: {
                    status: "pending",
                    OR: [{ nextRetryAt: null }, { nextRetryAt: { lte: now } }]
                },
                orderBy: { createdAt: "asc" },
                take: 50
            });

            for (const evt of batch) {
                try {
                    await safePublish(producer, TOPICS.created, evt.aggregateId, evt.payload, {
                        "x-event-id": evt.id,
                        "x-event-type": evt.type
                    });

                    await prisma.outboxEvent.update({
                        where: { id: evt.id },
                        data: { status: "sent" }
                    });
                } catch (e: any) {
                    const attempts = evt.attempts + 1;
                    const nextRetryAt = new Date(Date.now() + backoffMs(attempts));
                    await prisma.outboxEvent.update({
                        where: { id: evt.id },
                        data: {
                            attempts,
                            nextRetryAt,
                            status: attempts >= 8 ? "failed" : "pending"
                        }
                    });

                    logger.error({ err: e, eventId: evt.id, attempts }, "Outbox publish failed");
                }
            }
        } catch (e: any) {
            logger.error({ err: e }, "Outbox loop error");
        }
    }, 1000);

    const stop = async () => {
        clearInterval(interval);
        await producer.disconnect();
    };

    return { stop };
}
