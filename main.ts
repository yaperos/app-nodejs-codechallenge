import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Express } from 'express';
import { Model } from 'objection';
import knexConfig from "./knexfile";
import Knex from "knex";
import dotenv from "dotenv";
import { kafkaConsumer } from './src/events';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

// Initialize DB connection
// @ts-ignore
const env = process.env.NODE_ENV === "production" ? "production" : "development";
const knex = Knex(knexConfig[env]);
Model.knex(knex);

const corsOptions = {
  credentials: true,
  origin: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());


app.listen(port, () => {
  console.log(`started on localhost:${port}`);
});


// Set up Kafka Consumer
try {
  kafkaConsumer();
} catch {
  throw new Error("Error connecting to Kafka Consumer")
}