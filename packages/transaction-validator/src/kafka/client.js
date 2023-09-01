const Kafka = require("node-rdkafka");
const producer = require("./producer");
const Config = require("../config/constants");

const antiFraudValidate = () => {
  const consumer = new Kafka.KafkaConsumer(
    {
      "group.id": Config.kafka.KAFKA_GROUP_ID,
      "metadata.broker.list": Config.kafka.KAFKA_HOST,
      "auto.commit.enable": Config.kafka.KAFKA_AUTO_COMMIT_ENABLE,
    },
    {}
  );

  consumer.connect();
  consumer
    .on("ready", () => {
      consumer.subscribe([Config.kafka.KAFKA_TOPIC_VALIDATE]);
      consumer.consume();
    })
    .on("data", (data) => {
      try {
        const message = data.value.toString();
        const messageParsed = JSON.parse(message);
        console.log("Message Received:", messageParsed);
        const status = messageParsed.value > 1000 ? 3 : 2;
        producer.sendMessage({ id: messageParsed.id, status });
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    });

  consumer.on("event.error", (log) => {
    console.log("Log from producer:", log);
  });
};

module.exports = {
  antiFraudValidate,
};
