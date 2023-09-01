const Kafka = require("node-rdkafka");
const Config = require("../config/constants");

const sendMessage = (dataMessage) => {
  const producer = new Kafka.Producer({
    "metadata.broker.list": Config.kafka.KAFKA_HOST,
    dr_cb: true,
  });

  producer.connect();

  producer.on("ready", () => {
    try {
      producer.produce(Config.kafka.KAFKA_TOPIC_VALIDATE, null, Buffer.from(JSON.stringify(dataMessage)), null, Date.now());
      console.log("Message sended");
    } catch (error) {
      console.error("A problem occurred when sending our message");
      console.error(error);
    }
  });

  producer.on("event.error", (err) => {
    console.error("Error from producer");
    console.error(err);
  });

  producer.on("event.log", (log) => {
    console.log("Log from producer:", log);
  });
};

module.exports = {
  sendMessage,
};
