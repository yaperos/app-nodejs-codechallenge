import { z } from "zod";
export const transactionCreatedEventSchema = z.object({
  transactionExternalId: z
    .string()
    .uuid({ message: "transactionExternalId must be a valid UUID" }),
  accountExternalIdDebit: z
    .string()
    .uuid({ message: "accountExternalIdDebit must be a valid UUID" }),
  accountExternalIdCredit: z
    .string()
    .uuid({ message: "accountExternalIdCredit must be a valid UUID" }),
  transferTypeId: z
    .number()
    .int({ message: "transferTypeId must be an integer" })
    .positive({ message: "transferTypeId must be greater than zero" }),
  value: z
    .number()
    .positive({ message: "value must be greater than zero" }),
  createdAt: z
    .string()
    .datetime({ message: "createdAt must be an ISO datetime" })
});

export const parseTransactionCreatedEvent = (payload: unknown) =>
  transactionCreatedEventSchema.safeParse(payload);
