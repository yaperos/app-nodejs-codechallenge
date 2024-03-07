import express from "express";
import { kafka } from "./kafka";

const app = express();
app.use(express.json())

const consumer = kafka.consumer({ groupId: 'yape-transfer' });
const producer = kafka.producer();

async function run() {
	await consumer.subscribe({ topic: 'validate-transaction' });
	await consumer.connect()
  
	await consumer.run({
	  eachMessage: async ({ topic, partition, message }) => {
		
		console.log(`RECEIVED MESSAGE: ${JSON.stringify({ message: message.value!.toString()})}`)

		const transaction = JSON.parse(message.value!.toString());
		const { transactionExternalId, value } = transaction;

		const sendMessage = {
			transactionExternalId: transactionExternalId,
			status: value > 1000 ? "REJECTED" : "APPROVED"
		};

		console.log(`SEND MESSAGE: ${JSON.stringify({sendMessage})}`)

		await producer.connect()
		await producer.send({
			topic: "update-transaction",
			messages: [{ value: JSON.stringify(sendMessage) }]
		});
	  },
	});
  
	app.listen(3333);
}
  
run().catch(console.error)