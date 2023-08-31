const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./src/graphql/schema");
const kafkaConsumer = require("./src/kafka/consumer");

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(3000, () => {
  console.log("listen por 3000");
  kafkaConsumer.listenAndUpdateStatus();
});
