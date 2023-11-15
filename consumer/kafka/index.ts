import { KafkaClient, Consumer, OffsetFetchRequest, OffsetRequest, ConsumerGroup, Offset } from "kafka-node";
import { KAFKA_CLIENT_ID, KAFKA_HOST, TOPIC_NAME } from "../config";

export const kafkaClient = new KafkaClient({
  clientId: "yape",
  kafkaHost: "localhost:9092",
  connectTimeout: 3000,
  requestTimeout: 3000,
  connectRetryOptions: {
    maxTimeout: 30,
    minTimeout: 1,
    retries: 1,
  },
});

const topics = <Array<OffsetFetchRequest>>[{ topic: TOPIC_NAME ?? "t" }];

export const kafkaConsumer = new Consumer(kafkaClient, topics, {
  autoCommit: false,
  autoCommitIntervalMs: 5000,
  fetchMaxBytes: 1024 * 1024,
  fetchMaxWaitMs: 1000,
  fetchMinBytes: 1,
  fromOffset: true,
  encoding: "buffer",
  groupId: "YapeBasicConsumer",
});

export const consumerGroup = new ConsumerGroup(
  {
    autoCommit: true,
    kafkaHost: KAFKA_HOST,
    batch: undefined,
    ssl: false,
    groupId: "YapeGroupComsumer",
    sessionTimeout: 15000,
    protocol: ["roundrobin"],
    encoding: "buffer",
    fromOffset: "latest",
    outOfRangeOffset: "earliest",
  },
  TOPIC_NAME
);

export const offset = new Offset(kafkaClient);
