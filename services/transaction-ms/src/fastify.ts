import Fastify, { FastifyRequest } from "fastify";
import { ErrorFactory, HttpEvent } from "libs/src";
import { transactionHandler } from "./handlers";

export const fastify = Fastify({ logger: true });

fastify.get("/transaction/:id", async (request, reply) => {
  const event: HttpEvent = getHttpEvent(request);
  const response = await transactionHandler(event);

  reply.send(response);
});

fastify.post("/transaction", async (request, reply) => {
  const event: HttpEvent = getHttpEvent(request);
  const response = await transactionHandler(event);

  reply.send(response);
});

fastify.setErrorHandler((error, _, reply) => {
  const e = ErrorFactory.create(error);
  reply.status(e.statusCode).send(e.getApiData());
});

function getHttpEvent(request: FastifyRequest) {
  return {
    routerPath: request.routerPath,
    method: request.method,
    params: <HttpEvent["params"]>request.params,
    query: <HttpEvent["query"]>request.query,
    headers: request.headers,
    body: <HttpEvent["body"]>request.body,
  };
}
