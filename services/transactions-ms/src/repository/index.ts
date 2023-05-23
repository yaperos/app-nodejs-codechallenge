import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { z } from "zod";
import { TransactionsRepository } from "./transactions-repository";

const env = z
  .object({
    POSTGRES_STRING: z.string(),
  })
  .parse(process.env);

export const repository = new TransactionsRepository({
  postgresClient: drizzle(postgres(env.POSTGRES_STRING)),
});
