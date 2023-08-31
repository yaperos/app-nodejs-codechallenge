const Kafka = require("node-rdkafka");

const sendMessage = (dataMessage) => {
  const producer = new Kafka.Producer({
    "metadata.broker.list": "localhost:9092",
    dr_cb: true,
  });

  producer.connect();

  producer.on("ready", () => {
    try {
      producer.produce("answer-validated", null, Buffer.from(JSON.stringify(dataMessage)), null, Date.now());
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
