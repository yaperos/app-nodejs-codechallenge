import { antifraudContainer } from "./container.js";
import { startAntifraudMessaging } from "./bootstrap/startup.js";

const start = async () => {
  const stop = await startAntifraudMessaging();

  const shutdown = async () => {
    antifraudContainer.logger.info("shutting down antifraud service");
    await stop();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  antifraudContainer.logger.info("antifraud consumer is running");
};

start().catch((error) => {
  antifraudContainer.logger.error({ err: error }, "Failed to bootstrap antifraud service");
  process.exit(1);
});
