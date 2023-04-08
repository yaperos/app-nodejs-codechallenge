import { z } from "zod";

export const CreateTransactionBodySchema = z.object({
  accountExternalIdDebit: z.string().uuid(),
  accountExternalIdCredit: z.string().uuid(),
  tranferTypeId: z.number().int().gte(0).lte(2),
  value: z
    .number()
    .positive()
    .lte(1000, "Transaction with a value greater than 1000 is not allowed"),
});
