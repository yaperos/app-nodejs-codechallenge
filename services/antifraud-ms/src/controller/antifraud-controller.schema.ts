import { ServiceInput } from "@app-nodejs-codechallenge/shared-lib";
import { z } from "zod";
import { transactionStatus } from "../domain/antifraud";
import { AntifraudServiceI } from "../service/antifraud-service.interface";

export const processTransactionCreateSchema = z
  .object({
    value: z.string().nonempty(),
  })
  .transform((data) => JSON.parse(data.value))
  .pipe(
    z.object({
      topic: z.literal("transactions.create.done"),
      source: z.literal("transactions"),
      payload: z.object({
        transactionExternalId: z.string().nonempty(),
        transactionStatus: z.object({
          name: z.enum(transactionStatus),
        }),
      }),
    })
  )
  .transform(({ payload }) => {
    return {
      transaction: {
        transactionExternalId: payload.transactionExternalId,
        transactionStatus: payload.transactionStatus,
      },
    } satisfies ServiceInput<
      AntifraudServiceI,
      "processTransactionCreateEvent"
    >;
  });
