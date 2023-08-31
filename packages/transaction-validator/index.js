const express = require("express");
const clientKafka = require("./src/kafka/client");
const app = express();

app.listen(3001, () => {
  console.log("listen por 3001");
  clientKafka.listenAndUpdateStatus();
});
