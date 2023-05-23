/* eslint-disable no-console */
import http from "node:http";
import { ApiError } from "@app-nodejs-codechallenge/shared-lib";
import type { RouterContext } from "@koa/router";
import Koa from "koa";

export type HttpProxyEvent = {
  method: RouterContext["request"]["method"];
  route: RouterContext["_matchedRoute"];
  queryStringParameters: RouterContext["request"]["query"];
  pathParameters: RouterContext["params"];
  headers?: RouterContext["request"]["headers"];
  body?: string;
};

export type KafkaEvent = {
  topic: string;
  value: string;
};

export type Handler<I = object, O = object> = (event: I) => Promise<O>;

export const getRequestData = (req: http.IncomingMessage): Promise<string> =>
  new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      resolve(data);
    });
    req.on("error", (err) => {
      reject(err);
    });
  });

export const runHttpServer = <I extends HttpProxyEvent | KafkaEvent, O>(
  opts: { microservice: string; port: number },
  handler: Handler<I, O>
) => {
  new Koa()
    .use(async (ctx, next) => {
      let l = "-";

      try {
        const event: I = JSON.parse(await getRequestData(ctx.req));

        l = "method" in event ? `${event.method} ${event.route}` : event.topic;
        console.log(`START: ${l}`);

        const response = await handler(event);

        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = response ? JSON.stringify(response) : "";

        await next();
        console.log(`END: ${l}`);
      } catch (e) {
        const error = ApiError.from(e);
        const body = error.toApi();

        ctx.response.type = "application/json";
        ctx.response.status = error.statusCode;
        ctx.response.body = body;

        console.log(`ERROR: ${l} ${JSON.stringify(body)}`);
      }
    })
    .listen(opts.port, () => {
      console.log(`${opts.microservice} MS listening on port ${opts.port}`);
    });
};
