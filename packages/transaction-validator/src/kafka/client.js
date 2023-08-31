const Kafka = require("node-rdkafka");
const producer = require("./producer");

const listenAndUpdateStatus = () => {
  const consumer = new Kafka.KafkaConsumer(
    {
      "group.id": "my-group-one",
      "metadata.broker.list": "localhost:9092",
      "auto.commit.enable": false,
    },
    {}
  );

  consumer.connect();
  consumer
    .on("ready", () => {
      consumer.subscribe(["validate-data"]);
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
  listenAndUpdateStatus,
};
