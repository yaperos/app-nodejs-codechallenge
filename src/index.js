const express = require("express");
const sequelize = require("./database/connection");
const transactionRoutes = require("./routes/transaction.route");
const sendKafkaEvent = require("./helpers/kafkaConsumer.helper");
const {
  MESSAGE_START_SERVER,
  MESSAGE_SERVER_RUNNING_PORT,
  MESSAGE_ERROR_CONNECT_DATABASE,
} = require("./utils/constants.util");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/transactions", transactionRoutes);

sendKafkaEvent();

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log(MESSAGE_START_SERVER);

    await sequelize.sync();

    app.listen(PORT, () => {
      console.log(`${MESSAGE_SERVER_RUNNING_PORT} ${PORT}`);
    });
  } catch (error) {
    console.error(MESSAGE_ERROR_CONNECT_DATABASE, error);
  }
}

startServer();
