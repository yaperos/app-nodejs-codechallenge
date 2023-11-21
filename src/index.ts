import express from "express";
import helmet from "helmet";
import { connectDatabase } from "./config/database";
import { producer, startConsumer } from "./services/kafka";
import { logger } from "./config/logger";
import { errorHandler } from "./middleware/errorHandler";
import transactionRoutes from "./routes/transactions";

const app = express();

app.use(helmet());
app.use(express.json());

app.use("/api", transactionRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5001;

async function startServer() {
  try {
    await connectDatabase();
    await producer.connect();
    logger.info("Kafka Producer connected");

    startConsumer();

    const server = app.listen(PORT, () =>
      logger.info(`Server running on port: ${PORT}`)
    );

    process.on("SIGINT", () => {
      //seguro
      logger.info("Shutting down server...");
      server.close(() => {
        logger.info("Server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error("Error running server:", error);
    process.exit(1);
  }
}

startServer();
