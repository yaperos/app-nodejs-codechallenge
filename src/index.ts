import express from "express";
import helmet from "helmet";
import { connectDatabase } from "./config/database";

const app = express();

app.use(helmet());
app.use(express.json());

const PORT = process.env.PORT || 5001;

async function startServer() {
  try {
    await connectDatabase();

    const server = app.listen(PORT, () =>
      console.log(`Server running on port: ${PORT}`)
    );

    process.on("SIGINT", () => {
      console.log("Shutting down server...");
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    console.log("Error running server:", error);
    process.exit(1);
  }
}

startServer();
