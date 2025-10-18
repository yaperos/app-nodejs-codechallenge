import { buildApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";

const start = async () => {
  const app = buildApp();

  await app.listen({
    host: "0.0.0.0",
    port: env.PORT
  });

  logger.info({ port: env.PORT }, "HTTP server is running");
};

start().catch((error) => {
  logger.error({ err: error }, "Failed to bootstrap service");
  process.exit(1);
});
