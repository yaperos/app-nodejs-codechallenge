import { server } from "@infrastructure/index";
import cors from "cors";
import * as dotenv from "dotenv";
import express, { Request, Response } from "express";
import * as TransactionRoutes from "@routes/transaction.routes";
import { updateTransaction } from "@controller/index";

dotenv.config();

export const app = express();
const port = process.env.PORT || 4000;

/* Middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

updateTransaction().then();

app.use("/api/v1", [TransactionRoutes.router]);
app.get("/", (_: Request, res: Response) => {
  return res.json({ message: "Hello World!" });
});

app.listen(port, () => server(port));
