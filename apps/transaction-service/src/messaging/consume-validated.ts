import { createKafka, createConsumer, safePublish } from "@yape/kafka/src";
import { config } from "../config";
import { TOPICS } from "./topics";
import { logger } from "../utils/logger";
import { prisma } from "../db/prisma";
import { TransactionValidatedEventSchema } from "@yape/contracts/src";

export async function startValidatedConsumer() {
    const kafka = createKafka({ clientId: "transaction-service", brokers: config.kafkaBrokers });
    const consumer = await createConsumer(kafka, "transaction-service-updater");

    await consumer.subscribe({ topic: TOPICS.validated, fromBeginning: true });

    await consumer.run({
        autoCommit: false,
        eachMessage: async ({ topic, partition, message }) => {
            const raw = message.value?.toString() || "";

            try {
                const parsed = TransactionValidatedEventSchema.parse(JSON.parse(raw));

                // También idempotencia:
                const already = await prisma.processedEvent.findUnique({ where: { eventId: parsed.eventId } });
                if (already) {
                    await consumer.commitOffsets([{ topic, partition, offset: (Number(message.offset) + 1).toString() }]);
                    return;
                }

                // Solo actualiza si estaba pending (control de reprocesos)
                await prisma.$transaction(async (tx) => {
                    await tx.transaction.updateMany({
                        where: { transactionExternalId: parsed.transactionExternalId, status: "pending" },
                        data: { status: parsed.status }
                    });

                    await tx.processedEvent.create({ data: { eventId: parsed.eventId } });
                });

                logger.info(
                    { transactionExternalId: parsed.transactionExternalId, status: parsed.status, eventId: parsed.eventId },
                    "Transaction updated"
                );

                await consumer.commitOffsets([{ topic, partition, offset: (Number(message.offset) + 1).toString() }]);
            } catch (e: any) {
                logger.error({ err: e, raw }, "Validated consumer error -> DLQ");

                // DLQ por si no procesa el mensaje
                try {
                    const producer = kafka.producer();
                    await producer.connect();
                    await safePublish(producer, TOPICS.validatedDlq, message.key?.toString() || "dlq", { raw, error: e?.message });
                    await producer.disconnect();
                } catch {}

                await consumer.commitOffsets([{ topic, partition, offset: (Number(message.offset) + 1).toString() }]);
            }
        }
    });

    const stop = async () => {
        await consumer.disconnect();
    };

    return { stop };
}
