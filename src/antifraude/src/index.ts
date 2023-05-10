import { consumerRun } from './infrastructure/kafka/consumer';
import { CONSUMER_GROUP_ID, CONSUMER_TOPIC } from './shared/config';

consumerRun()

console.log(`Consumer running Topic:${CONSUMER_TOPIC} , ConsumerGroupId: ${CONSUMER_GROUP_ID}`);