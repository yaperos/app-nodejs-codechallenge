const express = require("express");
const clientKafka = require("./src/kafka/client");
const Config = require("./src/config/constants");
const app = express();

app.listen(Config.server.PORT, () => {
  console.log(`listen por ${Config.server.PORT}`);
  clientKafka.antiFraudValidate();
});
