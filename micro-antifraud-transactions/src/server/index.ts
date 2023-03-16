import cors from "cors";
import * as dotenv from "dotenv";
import express, { Request, Response } from "express";
import { server } from "@infrastructure/constants";
import { verifyTransaction } from "@controller/*";

dotenv.config();

export const app = express();
const port = process.env.PORT || 4001;

/* Middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

verifyTransaction().then();

app.get("/", (_: Request, res: Response) => {
  return res.json({ message: "Hello!" });
});

app.listen(port, () => server(port));
