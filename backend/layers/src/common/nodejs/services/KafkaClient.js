"use strict";

const { Kafka } = require('kafkajs')

class KafkaClient {
    constructor({
        brokers,
        mechanism = 'scram-sha-256',
        username, password
    }) {
        const kafka = new Kafka({
            brokers: brokers,
            sasl: {
                mechanism,
                username,
                password,
            },
            ssl: true,
        })
        this.producer = kafka.producer()
    }

    async sendEvent({
        topic, messages
    }) {
        await this.producer.connect()
        await this.producer.send({
            topic,
            messages,
        })
        await this.producer.disconnect()
    }

}

module.exports = KafkaClient;
