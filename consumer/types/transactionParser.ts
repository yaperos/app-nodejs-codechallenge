import { z } from "zod";

const transactionParser = z.object({
  accountExternalIdCredit: z.string().uuid(),
  accountExternalIdDebit: z.string().uuid(),
  tranferTypeId: z.number(),
  transactionId: z.string().uuid(),
  value: z.number(),
});

const dbTransactionParser = z.object({
  id: z.string(),
  account_external_id_debit: z.string().uuid(),
  account_external_id_credit: z.string().uuid(),
  transfer_type_id: z.string(),
  transfer_status_id: z.string(),
  value: z.string(),
  created_at: z.date(),
  transaction_id: z.string().uuid(),
  updated_at: z.date().nullable(),
});

export type DBTransaction = z.infer<typeof dbTransactionParser>;
export type Transaction = z.infer<typeof transactionParser>;
export default transactionParser;
