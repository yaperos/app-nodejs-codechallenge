import type { ServiceInput } from "@app-nodejs-codechallenge/shared-lib";
import { z } from "zod";
import { transactionType } from "../domain/transaction";
import type { TransactionsServiceI } from "../service/transactions-service.interface";

export const createTransactionSchema = z
  .object({
    body: z.string().nonempty(),
  })
  .transform((data) => JSON.parse(data.body))
  .pipe(
    z.discriminatedUnion("transferTypeId", [
      z.object({
        accountExternalIdDebit: z.string().uuid(),
        transferTypeId: z.literal(1),
        value: z.number(),
      }),
      z.object({
        accountExternalIdCredit: z.string().uuid(),
        transferTypeId: z.literal(2),
        value: z.number(),
      }),
    ])
  )
  .transform((data) => {
    return {
      transactionExternalId:
        "accountExternalIdDebit" in data
          ? data.accountExternalIdDebit
          : data.accountExternalIdCredit,
      transactionType: {
        name: transactionType[data.transferTypeId - 1],
      },
      transactionStatus: {
        name: "pending",
      },
      value: data.value,
    } satisfies ServiceInput<TransactionsServiceI, "createTransaction">;
  });

export const readTransactionSchema = z
  .object({
    pathParameters: z.object({
      id: z.string().uuid(),
    }),
  })
  .transform((data) => {
    return {
      transactionExternalId: data.pathParameters.id,
    } satisfies ServiceInput<TransactionsServiceI, "readTransaction">;
  });

export const processAntifraudUpdateSchema = z
  .object({
    topic: z.literal("antifraud.update.done"),
    value: z.string().nonempty(),
  })
  .transform((data) => JSON.parse(data.value))
  .pipe(
    z.object({
      topic: z.literal("antifraud.update.done"),
      source: z.literal("antifraud"),
      payload: z.object({
        transaction: z.object({
          transactionExternalId: z.string().uuid(),
        }),
        score: z.number().int(),
      }),
    })
  )
  .transform(({ payload }) => {
    return {
      transaction: {
        transactionExternalId: payload.transaction.transactionExternalId,
      },
      score: payload.score,
    } satisfies ServiceInput<
      TransactionsServiceI,
      "processTransactionUpdateEvent"
    >;
  });
