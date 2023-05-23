import fs from "node:fs/promises";
import path from "node:path";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { z } from "zod";

const env = z
  .object({
    POSTGRES_STRING: z.string(),
  })
  .parse(process.env);

const searchDir = path.join(__dirname, "../../services");

const searchForMigrations = async (
  dir: string,
  targetDir = ".drizzle",
  depth = 2,
  acc = <string[]>[]
): Promise<string[]> => {
  if (depth <= 0) {
    return acc;
  }

  try {
    const files = await fs.readdir(dir, { withFileTypes: true });

    for (const file of files) {
      if (file.isDirectory()) {
        const fullPath = path.join(dir, file.name);

        if (file.name === targetDir) {
          acc.push(fullPath);
          continue;
        }

        await searchForMigrations(fullPath, targetDir, depth - 1, acc);
      }
    }
  } catch (err) {
    console.error(`DB: Error reading directory ${dir}`);
  }

  return acc;
};

export const migrateDatabase = async () => {
  const directories = await searchForMigrations(searchDir);

  if (directories.length > 0) {
    const postgresClient = drizzle(
      postgres(env.POSTGRES_STRING, {
        max: 1,
        onnotice: () => {
          // DO NOTHING
        },
      }),
      { logger: false }
    );

    for (const directory of directories) {
      await migrate(postgresClient, { migrationsFolder: directory });
    }

    console.log("DB: Migrations complete");
  }
};
