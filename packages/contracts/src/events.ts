import { z } from 'zod';

// GUID laxo: acepta cualquier GUID (incluido 0000...), no solo UUID v1-v8 estrictos.
const guid = z
  .string()
  .regex(/^[0-9a-fA-F]{8}(-[0-9a-fA-F]{4}){3}-[0-9a-fA-F]{12}$/, 'Invalid GUID');

const envelope = {
  eventId: guid,
  version: z.literal(1),
  occurredAt: z.string(),
};

export const TransactionCreatedEventSchema = z.object({
  ...envelope,
  eventType: z.literal('transaction.created'),
  data: z.object({
    transactionExternalId: guid,
    accountExternalIdDebit: guid,
    accountExternalIdCredit: guid,
    transferTypeId: z.number().int().positive(),
    value: z.number().positive(),
  }),
});
export type TransactionCreatedEvent = z.infer<typeof TransactionCreatedEventSchema>;

export const ValidationStatusSchema = z.enum(['approved', 'rejected']);
export type ValidationStatus = z.infer<typeof ValidationStatusSchema>;

export const TransactionStatusUpdatedEventSchema = z.object({
  ...envelope,
  eventType: z.literal('transaction.status-updated'),
  data: z.object({
    transactionExternalId: guid,
    status: ValidationStatusSchema,
    reason: z.string().optional(),
  }),
});
export type TransactionStatusUpdatedEvent = z.infer<typeof TransactionStatusUpdatedEventSchema>;