import { KAFKA_TOPICS } from '../constants';
import { Consumer } from 'kafka-node';
import kafkaClient from './index';

export const YAPE_TASK_CONSUMER = new Consumer( kafkaClient, [{topic: KAFKA_TOPICS.TRANSACTION_REQUEST_VALIDATE}], { autoCommit: true });

YAPE_TASK_CONSUMER.on('error', function(err) {
    console.error(err)
})
