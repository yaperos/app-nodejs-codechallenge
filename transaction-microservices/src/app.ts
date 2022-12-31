import express from 'express';
import router from './router';
import ConsumerFactory from './bootstrap/consumer.kafka';
import { antifraudResolveService } from './services/antifraud.resolve.services';
import { config } from './config';

(async () => {
	if (config.env !== 'test') {
    const consumerFactory = new ConsumerFactory();
		consumerFactory.callbackRecived = antifraudResolveService;
		await consumerFactory.startConsumer();
  }
})();

const app = express();

app.disable('etag');
app.use(express.json());
app.use(router);

export default app;
