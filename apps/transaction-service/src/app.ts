import Fastify from "fastify";
import { logger } from "./utils/logger";
import { transactionsRoutes } from "./routes/transactions.routes";

export function buildApp() {
    const app = Fastify({
        logger: false
    });

    app.get("/health", async () => ({ ok: true }));

    app.setErrorHandler((err, req, reply) => {
        logger.error({ err }, "Unhandled error");
        reply.code(500).send({ error: "Internal Server Error" });
    });

    app.register(transactionsRoutes);

    return app;
}
