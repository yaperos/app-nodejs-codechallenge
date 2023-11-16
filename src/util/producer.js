const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'client-node-kafka',
    brokers: [process.env.KAFKA_HOST],
});

const producer = kafka.producer();


async function sendMessage(transaction) {

    await producer.connect();

    const message = {
        value: JSON.stringify(transaction)
    };

    try {
        const res = await producer.send({
            topic: 'transactions',
            messages: [message],
        });
        console.log(`Message sent: ${JSON.stringify(res)}`);
    } catch (error) {
        console.error(`Error sending message: ${error}`);
    }

    await producer.disconnect();

}

module.exports = { sendMessage }
