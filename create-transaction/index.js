const express = require("express");
const { Kafka } = require("kafkajs");
const { Pool } = require("pg");
const runConsumerTransaction = require("./consumer.transaction.js");

const app = express();
app.use(express.json());

const initTransaction = async () => {
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
  const producer = kafka.producer();

  await producer.connect();

  const sendMessage = async (message) => {
    await producer.send({
      topic: "topicTransaction",
      messages: [{ value: JSON.stringify(message) }],
    });
  };

  app.post("/", async (req, res) => {
    try {
      const resgiterTransaction = await pool.query(
        `
        INSERT INTO infotransaction (id, accountDebit, accountCredit, value, idTypeTransfer) VALUES ($1, $2, $3,$4, $5) RETURNING *
        `,
        [
          Date.now().toString(),
          req.body.accountExternalIdDebit,
          req.body.accountExternalIdCredit,
          req.body.value,
          req.body.tranferTypeId,
        ]
      );
      resgiterTransaction.rows[0] &&
        (await sendMessage(resgiterTransaction.rows[0]));

      res.status(201).send(req.body);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error", error);
    }
  });
};

setTimeout(initTransaction, 5000);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
  runConsumerTransaction();
});
