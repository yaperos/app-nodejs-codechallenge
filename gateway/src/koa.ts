import {
  type HttpProxyEvent,
  getRequestData,
} from "@app-nodejs-codechallenge/http-lib";
import Router, { type RouterContext } from "@koa/router";
import Koa, { type Next } from "koa";
import fetch from "node-fetch-native";
import { z } from "zod";
import { MicroserviceConfig, microservicesConfig } from "./config";

type MicroserviceConfigWithRoutes = MicroserviceConfig & {
  routes: NonNullable<MicroserviceConfig["routes"]>;
};

type EachMicroserviceRouteConfig = Pick<MicroserviceConfig, "name" | "port"> &
  NonNullable<MicroserviceConfig["routes"]>[number];

const env = z
  .object({
    PROXY_HOST: z.string(),
  })
  .parse(process.env);

const makeProxyTransactionsHttpRequest =
  (config: EachMicroserviceRouteConfig) =>
  async (ctx: RouterContext, next: Next) => {
    const event: HttpProxyEvent = {
      method: ctx.request.method,
      route: ctx._matchedRoute,
      headers: ctx.request.headers,
      queryStringParameters: ctx.request.query,
      pathParameters: ctx.params,
      body: await getRequestData(ctx.req),
    };

    const response = await fetch(`http://${env.PROXY_HOST}:${config.port}/`, {
      method: "POST",
      body: JSON.stringify(event),
    });

    ctx.response.body = await response.text();
    ctx.response.status = response.status;
    ctx.response.type = "application/json";

    next();
  };

export const proxyHttpEvents = async (port = 3000) => {
  const app = new Koa();
  const router = new Router();

  const allConfig: EachMicroserviceRouteConfig[] = microservicesConfig
    .filter((ms): ms is MicroserviceConfigWithRoutes => Boolean(ms.routes))
    .map((ms) =>
      ms.routes.map((route) => ({
        name: ms.name,
        port: ms.port,
        ...route,
      }))
    )
    .flat();

  for (const config of allConfig) {
    router.register(
      config.path,
      config.methods,
      makeProxyTransactionsHttpRequest(config)
    );
  }

  app.use(router.routes()).use(router.allowedMethods());

  app.listen(port, () => {
    console.log(`HTTP: listening on port ${port}`);
  });
};
