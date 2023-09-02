import Event from "./models/Event";
import Transaction from "./models/Transaction";
import transaction_services from "./services/transaction_services";
import antifraud_services from "./services/antifraud_services";
import { Kafka, Partitioners } from "kafkajs";

const kafka = new Kafka({
  brokers: [`localhost:9092`],
})

async function kafkaConsumer() {
  const consumer = kafka.consumer({ groupId: "app-nodejs-codechallenge" });
  await consumer.connect();
  await consumer.subscribe({ topics: ["transactions"] });
  await consumer.run({ eachMessage: async ({ message }) => {
      await handleEvent({
        type: message.key!.toString() as Event.Type,
        value: JSON.parse(message.value!.toString()),
      });
  },
  });
}

async function kafkaProducer() {
  const producer = kafka.producer({
    createPartitioner: Partitioners.DefaultPartitioner,
  });
  // await producer.connect();

  console.log("Producer ready");
  return producer;
}

async function sendEvent({
  type,
  value,
}: {
  type: Event.Type;
  value: Event.Data;
}) {
  const producer = await kafkaProducer();

  const message = {
    key: type,
    value: JSON.stringify(value),
  }

  await producer.send({
    topic: "transactions",
    messages: [message],
  });

}


async function handleEvent(event) {
  switch (event.type) {
    case Event.Type.NEW_TRANSACTION:
      antifraud_services.reviewTransaction(event.value!.transactionId);
      break;
    case Event.Type.TRANSACTION_ACCEPTED:
      transaction_services.updateTransactionStatus({
        id: event.value!.transactionId,
        status: Transaction.Status.APPROVED,
      })
      break;
    case Event.Type.TRANSACTION_REJECTED:
      transaction_services.updateTransactionStatus({
        id: event.value!.transactionId,
        status: Transaction.Status.REJECTED,
      })
      break;
    default:
      break;
  }

}

export {
  kafkaConsumer,
  sendEvent,
  handleEvent,
}