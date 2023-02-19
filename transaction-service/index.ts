import { config } from "dotenv";
import express, { Express } from "express";
import { logger } from "./src/domain/bootstrap/logger.js";
import { StartPublisherSubscriberService } from "./src/domain/bootstrap/publish-subscribe.js";
import { registerRoutes } from "./src/infraestructure/routes/index.js";

config();

const app: Express = express();
const port = process.env.APP_PORT || 3000;

StartPublisherSubscriberService();

app.use(express.json());

registerRoutes(app);

app.listen(port, () => {
  logger.log(`Transaction service started on ${port}`);
});
