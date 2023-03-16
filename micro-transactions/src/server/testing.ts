import { server } from "@infrastructure/index";
import cors from "cors";
import * as dotenv from "dotenv";
import express, { Request, Response } from "express";
import * as TransactionRoutes from "@routes/transaction.routes";
import { updateTransaction } from "@controller/index";

dotenv.config();

export const app_test = express();
const port = process.env.PORT || 5000;

/* Middlewares */
app_test.use(express.json());
app_test.use(express.urlencoded({ extended: true }));
app_test.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

updateTransaction().then();

app_test.use("/api/v1", [TransactionRoutes.router]);
app_test.get("/", (_: Request, res: Response) => {
  return res.json({ message: "Hello World!" });
});

app_test.listen(port, () => server(port));
