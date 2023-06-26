const { Kafka } = require('kafkajs');

class KafkaConfig {

    constructor() {
        this.kafka = new Kafka({
            clienteId: 'my-producer',
            brokers: ['localhost:9092']
        })
        this.producer = this.kafka.producer();
        this.consumer = this.kafka.consumer({ groupId: 'antifraud-group' });
    }

    async produce(topic, messages) {
        try {
            await this.producer.connect()
            await this.producer.send({
                topic: topic,
                messages: messages
            })
        } catch (err) {
            console.log(err);
        } finally {
            await this.producer.disconnect();
        }
    }

    async consume(topic, callback) {
        try {
            await this.consumer.connect()
            await this.consumer.subscribe({ topic: topic, fromBeginning: true })
            await this.consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    const value = message.value
                    callback(value)
                }
            })
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = KafkaConfig;