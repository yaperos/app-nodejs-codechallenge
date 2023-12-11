const Kafka = require("node-rdkafka");
const pool = require("../config/database");
const Config = require("../config/constants");

const listenAndUpdateStatus = () => {
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
      consumer.subscribe([Config.kafka.KAFKA_TOPIC_VALIDATE_ANSWER]);
      consumer.consume();
    })
    .on("data", async (data) => {
      const message = data.value.toString();
      const messageParsed = JSON.parse(message);
      console.log("Message Received:", messageParsed);
      const { id, status } = messageParsed;
      const query = `UPDATE transactions SET transaction_status=$2, offset_kafka=$3 WHERE id=$1 AND offset_kafka IS NULL;`;
      const values = [id, status, data.offset];
      try {
        await pool.query(query, values);
        console.log("Transaction processed");
        consumer.commit(data);
      } catch (error) {
        console.error("Error updating transaction:", error);
      }
    });

  consumer.on("event.error", (log) => {
    console.log("Log from producer:", log);
  });
};

module.exports = {
  listenAndUpdateStatus,
};
