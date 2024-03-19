import express from 'express';
import KafkaConfig from './kafka-config/kafka.js';
import { ValidationAntiFraud } from './services/validation-anti-fraud.js';

const app = express();
const port = 3001;

const kafkaConfig = new KafkaConfig();

kafkaConfig.consume('transaction-verification-send', (value) => {
    const result = ValidationAntiFraud(value);
    kafkaConfig.produce('transaction-verification', result);
});

app.get('/', (req, res) => {
  res.send('system anti-fraud');
});

app.listen(port);