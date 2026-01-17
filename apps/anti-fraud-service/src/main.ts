import { logger } from "./utils/logger";
import { startCreatedConsumer } from "./messaging/consume-created";

async function main() {
    const consumer = await startCreatedConsumer();
    logger.info("Anti-fraud service started");

    const shutdown = async () => {
        logger.info("Shutting down...");
        await consumer.stop();
        process.exit(0);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
}

main().catch((e) => {
    logger.error({ err: e }, "Fatal error");
    process.exit(1);
});
