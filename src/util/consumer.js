const { Kafka } = require('kafkajs');
const { validate } = require('../service/antifraudService');

const kafka = new Kafka({
    clientId: 'client-node-kafka',
    brokers: [process.env.KAFKA_HOST],
});

const consumer = kafka.consumer({ groupId: 'my-group' });

const consumeMessages = async () => {
    let messageCount = 0;
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    await consumer.connect();
    await consumer.subscribe({ topic: 'transactions', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log('Message received', {
                value: message.value.toString(),
                topic,
                partition,
                offset: message.offset,
            });
            
            const transactionReg = JSON.parse(message.value.toString());
            if (typeof transactionReg !== 'undefined' || transactionReg !== null) {
                await validate(transactionReg);
            }

            messageCount++;

            if (messageCount >= 5) {
                messageCount = 0;
                await sleep(15000);
            }
        },
    });

    setTimeout(async () => {
        await consumer.stop();
        console.log('Consumer stopped.');
    }, 20000);
}

module.exports = { consumeMessages }