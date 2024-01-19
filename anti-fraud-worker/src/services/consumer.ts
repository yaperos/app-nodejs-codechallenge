import { ConsumerRunConfig } from "kafkajs"
import kafka from "../config/kafka"
import { config } from "../config"
import { ETopicsTransaction } from "../@types";

export default class Consumer {
    private consumer;
    readonly topics;

    constructor(topics: ETopicsTransaction[]) {
        this.consumer = kafka.consumer({ groupId: config.KAFKA_GROUP_ID })
        this.topics = topics;
    }

    async connectAndSuscriber() {
        await this.consumer.connect()
        await this.consumer.subscribe({ topics: this.topics })     
    }

    async run(config: ConsumerRunConfig) {
        return await this.consumer.run(config);
    }
}