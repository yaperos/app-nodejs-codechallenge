import dotenv from "dotenv";
import type { Config } from "drizzle-kit";
import { z } from "zod";

dotenv.config();

const env = z
  .object({
    POSTGRES_STRING: z.string(),
  })
  .parse(process.env);

export default {
  schema: "./src/repository/*-database.ts",
  connectionString: env.POSTGRES_STRING,
  out: "./.drizzle",
} satisfies Config;
