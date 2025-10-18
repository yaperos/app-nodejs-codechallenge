import { buildApp } from "./http/app.js";
import { startMessaging } from "./bootstrap/startup.js";
import { transactionsContainer } from "./container.js";

const start = async () => {
  const app = buildApp();
  const stopMessaging = await startMessaging();

  const shutdown = async () => {
    transactionsContainer.logger.info("shutting down transactions service");
    await app.close();
    await stopMessaging();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  await app.listen({
    host: "0.0.0.0",
    port: transactionsContainer.env.PORT
  });

  transactionsContainer.logger.info(
    { port: transactionsContainer.env.PORT },
    "transactions HTTP server is running"
  );
};

start().catch((error) => {
  transactionsContainer.logger.error({ err: error }, "Failed to bootstrap transactions service");
  process.exit(1);
});
