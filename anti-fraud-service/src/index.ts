import { KafkaService } from "common-microservice-lib";

const setting = {
  brokers: ["kafka:9092"],
  clientId: "client-id-1",
  groupId: "group-id-1",
};

const transactionExternalTopic = "transaction-external";

const kafkaService = new KafkaService(setting);

kafkaService.subcribeMessageFromTopic(transactionExternalTopic, (data) => {
  kafkaService.sendMessageToTopic({
    topic: transactionExternalTopic,
    value: { id: data.transactionExternalId, isValid: data.value <= 1000 },
  });
});
