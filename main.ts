import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import { Model } from 'objection';
import knexConfig from "./knexfile";
import Knex from "knex";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

// Initialize DB connection
// @ts-ignore
const env = process.env.NODE_ENV === "production" ? "production" : "development";
const knex = Knex(knexConfig[env]);
console.log(process.env.NODE_ENV);
Model.knex(knex);

const corsOptions = {
  credentials: true,
  origin: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.post('/test-endpoint', async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    res.status(200).send();
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.listen(port, () => {
  console.log(`started on localhost:${port}`);
});