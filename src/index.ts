import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';
import { transactionsRouter } from './transactions/transactions.controller';
import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/not-found.middleware';
import { antiFraudService } from './common/anti-fraud.service';
import Kafka from './common/kafka.provider';

require('dotenv').config();

if (!process.env.PORT) process.exit(1);

// Retrieving environment variables
const PORT: number = parseInt(process.env.PORT as string, 10);
const KAFKA_TOPIC = process.env.KAFKA_TOPIC || 'kafka-topic';
const KAFKA_GROUP_ID = process.env.KAFKA_GROUP_ID || 'group-id'

// Creating Kafka client and consumer
const kafkaClient = Kafka.getClient();
const consumer = kafkaClient.consumer({ groupId: KAFKA_GROUP_ID });

const app = express();

// Adding important middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Adding routers to server
app.use('/api/v1', transactionsRouter);

// Using error handlers
app.use(errorHandler);
app.use(notFoundHandler);

const start = async () => {
  try {
    // Running a Kafka antiFraud (fake) consumer
    await consumer.connect();
    await consumer.subscribe({ topic: KAFKA_TOPIC, fromBeginning: true });
    await consumer.run({
      eachMessage: antiFraudService,
    });

    // Starting Express server
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();