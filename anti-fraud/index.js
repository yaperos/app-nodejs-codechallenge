const axios = require("axios");
const kafka = require("kafka-node");
const client = new kafka.KafkaClient({ kafkaHost: "localhost:9092" });
const consumer = new kafka.Consumer(client, [
  { topic: "transaction", partition: 0 },
]);

const approveOrReject = () => {
  const randomNumber = Math.random();
  if (randomNumber >= 0.5) {
    return "APPROVED";
  } else {
    return "REJECTED";
  }
};

consumer.on("message", function (message) {
  const { id } = JSON.parse(message.value)

  const status = approveOrReject();

  var data = JSON.stringify({
    query: `mutation updateTransaction($input: TransactionUpdateInput!){
      updateTransaction(tran: $input){
          idTransaction
          status
      }
  }`,
    variables: { input: { idTran: id, status } },
  });

  var config = {
    method: "post",
    url: "http://localhost:3000/graphql",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
});

consumer.on("error", function (err) {
  console.error(err);
});
