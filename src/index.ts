import express from "express";
import helmet from "helmet";
import { connectDatabase } from "./config/database";
import { logger } from "./config/logger";

const app = express();

app.use(helmet());
app.use(express.json());

const PORT = process.env.PORT || 5001;

async function startServer() {
  try {
    await connectDatabase();

    const server = app.listen(PORT, () =>
      logger.info(`Server running on port: ${PORT}`)
    );

    process.on("SIGINT", () => {
      logger.info("Shutting down server...");
      server.close(() => {
        logger.info("Server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    logger.info("Error running server:", error);
    process.exit(1);
  }
}

startServer();
