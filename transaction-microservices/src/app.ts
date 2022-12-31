import express from 'express';
import router from './router';
import ConsumerFactory from './bootstrap/consumer.kafka';
import { antifraudResolveService } from './services/antifraud.resolve.services';

const consumerFactory = new ConsumerFactory();
consumerFactory.callbackRecived = antifraudResolveService;
consumerFactory.startConsumer();

const app = express();

app.disable('etag');
app.use(express.json());
app.use(router);

export default app;
