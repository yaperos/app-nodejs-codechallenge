import { createKafka, createConsumer, createProducer, safePublish } from "@yape/kafka/src";
import { config } from "../config";
import { TOPICS } from "./topics";
import { logger } from "../utils/logger";
import { TransactionCreatedEventSchema, TransactionValidatedEventSchema } from "@yape/contracts/src";
import { validate } from "../domain/antiFraudPolicy";
import { randomUUID } from "crypto";

const processed = new Set<string>(); // Ya en producción debería de ser BBDD/Redis

export async function startCreatedConsumer() {
    const kafka = createKafka({ clientId: "anti-fraud-service", brokers: config.kafkaBrokers });
    const consumer = await createConsumer(kafka, "anti-fraud-service");
    const producer = await createProducer(kafka);

    await consumer.subscribe({ topic: TOPICS.created, fromBeginning: true });

    await consumer.run({
        autoCommit: false,
        eachMessage: async ({ topic, partition, message }) => {
            const raw = message.value?.toString() || "";

            try {
                const created = TransactionCreatedEventSchema.parse(JSON.parse(raw));

                // Aplicamos idempotencia
                if (processed.has(created.eventId)) {
                    await consumer.commitOffsets([{ topic, partition, offset: (Number(message.offset) + 1).toString() }]);
                    return;
                }

                const res = validate(created.value);

                const now = new Date();
                const validated = TransactionValidatedEventSchema.parse({
                    eventId: randomUUID(),
                    correlationId: created.correlationId,
                    occurredAt: now.toISOString(),
                    transactionExternalId: created.transactionExternalId,
                    status: res.status,
                    reason: res.reason,
                    validatedAt: now.toISOString()
                });

                await safePublish(producer, TOPICS.validated, created.transactionExternalId, validated, {
                    "x-correlation-id": created.correlationId
                });

                processed.add(created.eventId);

                logger.info(
                    { transactionExternalId: created.transactionExternalId, status: validated.status },
                    "Validated transaction"
                );

                await consumer.commitOffsets([{ topic, partition, offset: (Number(message.offset) + 1).toString() }]);
            } catch (e: any) {
                logger.error({ err: e, raw }, "Created consumer error -> DLQ");

                // DLQ por si no procesa el mensaje
                try {
                    await safePublish(producer, TOPICS.createdDlq, message.key?.toString() || "dlq", { raw, error: e?.message });
                } catch {}

                await consumer.commitOffsets([{ topic, partition, offset: (Number(message.offset) + 1).toString() }]);
            }
        }
    });

    const stop = async () => {
        await consumer.disconnect();
        await producer.disconnect();
    };

    return { stop };
}
