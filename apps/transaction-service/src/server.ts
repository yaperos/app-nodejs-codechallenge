import { config } from "./config";
import { buildApp } from "./app";
import { logger } from "./utils/logger";
import { startOutboxPublisher } from "./messaging/publish-outbox";
import { startValidatedConsumer } from "./messaging/consume-validated";
import { prisma } from "./db/prisma";

async function main() {
    const app = buildApp();

    const outbox = await startOutboxPublisher();
    const validated = await startValidatedConsumer();

    await app.listen({ port: config.port, host: "0.0.0.0" });
    logger.info({ port: config.port }, "Transaction service started");

    const shutdown = async () => {
        logger.info("Shutting down...");
        await outbox.stop();
        await validated.stop();
        await app.close();
        await prisma.$disconnect();
        process.exit(0);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
}

main().catch((e) => {
    logger.error({ err: e }, "Fatal error");
    process.exit(1);
});
