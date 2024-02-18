const express = require("express");
const { Kafka } = require("kafkajs");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

const initValidateTransaction = async () => {
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

  const consumer = kafka.consumer({ groupId: "test-transaction" });

  await consumer.connect();
  await consumer.subscribe({ topic: "topicTransaction", fromBeginning: true });

  const producer = kafka.producer();
  await producer.connect();

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const { value } = message;
        const data = JSON.parse(value);
        const status = data.value > 1000 ? "RECHAZADA" : "APROBADA";

        const typeTransfer = await pool.query(
          `SELECT name FROM typetransfer WHERE id = $1`,
          [data.idtypetransfer]
        );
        if (typeTransfer.rows[0] !== undefined) {
          console.log("typeTransfer aca", typeTransfer.rows[0]);
          const validateTransaction = await pool.query(
            `INSERT INTO validatetransaction (id, idtransaction, typetransaction, value, status) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [
              Date.now().toString(),
              data.id,
              typeTransfer.rows[0].name,
              data.value,
              status,
            ]
          );
          console.log('Transacción',validateTransaction.rows[0].status)
          if(validateTransaction.rows[0].status!=='PENDIENTE'){
            await producer.send({
              topic: "topic1",
              messages: [{ value: JSON.stringify(validateTransaction.rows[0]) }],
            });
            
          }
          
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    },
  });
};

setTimeout(initValidateTransaction, 5000);

app.listen(process.env.PORT);
