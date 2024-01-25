import express, { Application, Response } from "express";
import morgan from "morgan";

import { NotFoundErrorHandler } from "./middlewares/NotFoundErrorHandler";
import { ErrorHandler } from "./middlewares/ErrorHandler";
import { ConfigEnv } from "./config";

const app: Application = express();

app.use(morgan(":method :status :url :response-time ms"));

app.get("/health-check", (_req, res: Response, _next) => {
  res.json({ status: "health check ok" });
});

app.use(NotFoundErrorHandler);
app.use(ErrorHandler);

app.listen(ConfigEnv.port, () => {
  console.log("Server is running on port", ConfigEnv.port);
});
