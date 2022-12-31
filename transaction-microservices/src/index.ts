import app from './app';
import { config } from './config';
import ConsumerFactory from './bootstrap/consumer.kafka';
import { antifraudResolveService } from './services/antifraud.resolve.services';

(async () => {
  const consumerFactory = new ConsumerFactory(config.kafkaTopicAntifraud);
  consumerFactory.callbackRecived = antifraudResolveService;
  await consumerFactory.startConsumer();
})();

app.listen(config.port, () => {
  console.log(`App is running on port ${config.port}`);
});
