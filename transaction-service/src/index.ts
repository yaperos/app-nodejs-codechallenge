import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { v1Router } from "./modules/transactionExternal/infra/http/api";

export * from "./modules/notification";
export * from "./modules/transactionExternal";

const origin = {
  origin: "*", // only to dev
};

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(origin));
app.use(compression());
app.use(helmet());
app.use(morgan("combined"));

app.use("/api/v1", v1Router);

startServer();

async function startServer() {
  const port = process.env.PORT || 5000;
  //await connectDB();
  app.listen(port, () => {
    console.log(`App: Listening on port ${port}`);
  });
}
