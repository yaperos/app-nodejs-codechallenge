import { prisma } from "../db/prisma";
import { randomUUID } from "crypto";
import { TransactionCreateRequestSchema, TransactionCreatedEventSchema } from "@yape/contracts/src";
import { requestHash } from "../utils/idempotency";

export async function createTransaction(input: unknown, idempotencyKey?: string) {
    const dto = TransactionCreateRequestSchema.parse(input);

    if (idempotencyKey) {
        const hash = requestHash(dto);
        const found = await prisma.idempotencyKey.findUnique({ where: { key: idempotencyKey } });
        if (found) {
            if (found.requestHash !== hash) {
                const err = new Error("Idempotency-Key reuse with different payload");
                (err as any).statusCode = 409;
                throw err;
            }
            return found.responseBody;
        }
    }

    const transactionExternalId = randomUUID();
    const correlationId = randomUUID();
    const eventId = randomUUID();
    const now = new Date();

    const createdEvent = TransactionCreatedEventSchema.parse({
        eventId,
        correlationId,
        occurredAt: now.toISOString(),
        transactionExternalId,
        accountExternalIdDebit: dto.accountExternalIdDebit,
        accountExternalIdCredit: dto.accountExternalIdCredit,
        transferTypeId: dto.tranferTypeId,
        value: dto.value,
        createdAt: now.toISOString()
    });

    const responseBody = {
        transactionExternalId,
        transactionStatus: { name: "pending" }
    };

    await prisma.$transaction(async (tx) => {
        await tx.transaction.create({
            data: {
                transactionExternalId,
                accountExternalIdDebit: dto.accountExternalIdDebit,
                accountExternalIdCredit: dto.accountExternalIdCredit,
                transferTypeId: dto.tranferTypeId,
                value: dto.value.toString(),
                status: "pending"
            }
        });

        await tx.outboxEvent.create({
            data: {
                id: eventId,
                aggregateId: transactionExternalId,
                type: "TransactionCreated",
                payload: createdEvent
            }
        });

        if (idempotencyKey) {
            await tx.idempotencyKey.create({
                data: {
                    key: idempotencyKey,
                    requestHash: requestHash(dto),
                    responseBody
                }
            });
        }
    });

    return responseBody;
}
