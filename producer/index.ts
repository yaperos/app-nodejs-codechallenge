import fastify from "fastify";
import { getTransaction, postTransaction } from "./controllers/producer";
import { KAFKA_CLIENT_ID, KAFKA_HOST, TOPIC_NAME } from "./config/constants";
import { dbConnection } from "./database";

const server = fastify();

const init = async () => {
  await dbConnection();
};

if (!TOPIC_NAME || !KAFKA_CLIENT_ID || !KAFKA_HOST) {
  throw new Error("config file not found!");
}

server.post("/transaction", postTransaction);
server.get("/transaction/:transactionId", getTransaction);

server.listen({ port: 9090 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
  init();
});
