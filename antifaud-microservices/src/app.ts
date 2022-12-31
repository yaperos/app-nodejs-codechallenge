import express from 'express';
import router from './router';
import ConsumerFactory from './bootstrap/consumer.kafka';
import { antifraudService } from './services/antifraud.services';

(async () => {
	const consumerFactory = new ConsumerFactory();
	consumerFactory.callbackRecived = antifraudService;
	consumerFactory.startConsumer();
})();

const app = express();

app.disable('etag');
app.use(express.json());
app.use(router);

export default app;
