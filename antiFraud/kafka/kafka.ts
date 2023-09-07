import { Kafka } from "kafkajs";
import { ITransaction } from "../interfaces/ITransaction";
import Status from "../constans/statusConstant";
import Topics from "../constans/topics";
const kafka = new Kafka({
  clientId: "antifraud-app",
  brokers: ["0.0.0.0:9092"],
});

const consumer = kafka.consumer({ groupId: "antifraud-app" });
const producer = kafka.producer();
const topicToRead = "pending-topic";

async function messageCreateHandler(data: any) {
  const res: ITransaction = data;
  if (res.value > 1000) {
    res.status = Status.REJECT;
  } else {
    res.status = Status.APPROVE;
  }
  console.log("sending response to transaction module");
  await producer.send({
    topic: Topics.result,
    messages: [{ value: JSON.stringify(res) }],
  });
  console.log("sending", res);
}

const topicsToSubscribe: Record<typeof topicToRead, (data: any) => void> = {
  "pending-topic": messageCreateHandler,
};

export async function consumerConnected() {
  producer.connect();
  consumer.connect();
  console.log("consumer conected");

  await consumer.subscribe({ topic: topicToRead, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (!message || !message.value) {
        return;
      }

      const data = JSON.parse(message.value.toString());
      const handler = topicsToSubscribe[topic as typeof topicToRead];
      if (handler) {
        handler(data);
      }
    },
  });
}
