const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./src/graphql/schema");
const kafkaConsumer = require("./src/kafka/consumer");
const app = express();
const Config = require("./src/config/constants");

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(Config.server.PORT, () => {
  console.log(`listen por ${Config.server.PORT}`);
  kafkaConsumer.listenAndUpdateStatus();
});
