import { z } from "zod";

export const createTransactionInputSchema = z.object({
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
    .positive({ message: "value must be greater than zero" })
});

export const createTransactionArgsSchema = z.object({
  input: createTransactionInputSchema
});

export const transactionQueryArgsSchema = z.object({
  transactionExternalId: z
    .string()
    .uuid({ message: "transactionExternalId must be a valid UUID" })
});
