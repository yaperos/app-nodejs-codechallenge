import "dotenv/config";

export const ConfigEnv = {
  port: process.env.PORT ?? 5000,
  serverTag: process.env.SERVER_TAG ?? "ms-anti-fraud",
};
