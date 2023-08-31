const Kafka = require("node-rdkafka");
const pool = require("../config/database");

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
      consumer.subscribe(["answer-validated"]);
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
