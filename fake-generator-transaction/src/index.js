const { default: axios } = require("axios");
const cron = require("node-cron");
const { logger } = require("./datadog");

async function start() {
  const axios = require("axios");
  const data = JSON.stringify({
    query:
      "mutation Create($createTransactionInput: CreateTransactionInput!) {\n  create(createTransactionInput: $createTransactionInput) {\n    value\n  }\n}",
    variables: {
      createTransactionInput: {
        value: 500,
        transactionStatus: "hola",
        transactionType: "null",
        transactionExternalId: "null",
        tranferTypeId: "null",
        accountExternalIdDebit: "null",
        accountExternalIdCredit: "null",
      },
    },
  });

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://transaction-api:3003/graphql",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    console.log(JSON.stringify(response.data));
  } catch (error) {
    console.log(error);
  }
}
cron.schedule("*/1 * * * * *", async () => {
  logger.log("info", {
    message: "generate fake transaction every minute",
    time: Date.now(),
  });
  start();
});
