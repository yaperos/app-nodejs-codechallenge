const { Kafka } = require("kafkajs");
const { Pool } = require("pg");
const runConsumerTransaction = async () => {
  const pool = new Pool({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT,
  });
  const kafka = new Kafka({
    clientId: "transactions",
    brokers: [process.env.KAFKA_BOOTSTRAP_SERVERS],
  });
  const consumer = kafka.consumer({ groupId: "test-transaction-1" });

  await consumer.connect();
  await consumer.subscribe({ topic: "topicTransaction", fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = JSON.parse(message.value.toString());

      if (value.status !== "PENDIENTE") {
        console.log("transacción en estado", value.statu);
        await pool.query(
          `update infotransaction set status = $1 where id = $2`,
          [value.status, value.idtransaction]
        );
      }
    },
  });
};
module.exports = runConsumerTransaction;
