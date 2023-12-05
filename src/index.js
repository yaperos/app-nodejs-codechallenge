const express = require("express");
const sequelize = require("./database/connection");
const transactionRoutes = require("./routes/transaction.route");
const sendKafkaEvent = require("./helpers/kafkaConsumer.helper");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/transactions", transactionRoutes);

sendKafkaEvent();

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Conexión establecida con la base de datos.");

    await sequelize.sync();

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
  }
}

startServer();
