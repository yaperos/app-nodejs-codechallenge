import { z } from "zod";

export const Guid = z.string().uuid();

export const TransactionCreateRequestSchema = z.object({
    accountExternalIdDebit: Guid,
    accountExternalIdCredit: Guid,
    tranferTypeId: z.number().int().positive(),
    value: z.number().positive()
});

export type TransactionCreateRequest = z.infer<typeof TransactionCreateRequestSchema>;

export const TransactionCreatedEventSchema = z.object({
    eventId: Guid,
    correlationId: Guid,
    occurredAt: z.string().datetime(),
    transactionExternalId: Guid,
    accountExternalIdDebit: Guid,
    accountExternalIdCredit: Guid,
    transferTypeId: z.number().int().positive(),
    value: z.number().positive(),
    createdAt: z.string().datetime()
});

export type TransactionCreatedEvent = z.infer<typeof TransactionCreatedEventSchema>;

export const TransactionValidatedEventSchema = z.object({
    eventId: Guid,
    correlationId: Guid,
    occurredAt: z.string().datetime(),
    transactionExternalId: Guid,
    status: z.enum(["approved", "rejected"]),
    reason: z.string().min(1),
    validatedAt: z.string().datetime()
});

export type TransactionValidatedEvent = z.infer<typeof TransactionValidatedEventSchema>;

export function stableJson(obj: unknown): string {
    // Para hashing determinístico de requests (idempotencia)
    return JSON.stringify(obj, Object.keys(obj as any).sort());
}
