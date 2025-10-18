import { logger } from "./logger.js";
import { env } from "./env.js";
import { prisma } from "../db/prisma-client.js";

export const container = {
  env,
  logger,
  prisma
};

export type AppContainer = typeof container;
