import { FastifyInstance } from "fastify";
import { createTransaction } from "../application/create-transaction";
import { getTransaction } from "../application/get-transaction";

export async function transactionsRoutes(app: FastifyInstance) {
    app.post("/transactions", async (req, reply) => {
        const idempotencyKey = (req.headers["idempotency-key"] as string | undefined)?.trim();

        try {
            const result = await createTransaction(req.body, idempotencyKey);
            return reply.code(201).send(result);
        } catch (e: any) {
            const status = e?.statusCode || 400;
            return reply.code(status).send({ error: e.message });
        }
    });

    app.get("/transactions/:transactionExternalId", async (req, reply) => {
        const { transactionExternalId } = req.params as any;

        const tx = await getTransaction(transactionExternalId);
        if (!tx) return reply.code(404).send({ error: "Transaction not found" });

        return reply.send(tx);
    });
}
