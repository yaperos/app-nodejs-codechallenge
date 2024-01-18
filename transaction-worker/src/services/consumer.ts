import { ConsumerRunConfig } from "kafkajs"
import kafka from "../config/kafka"
import { config } from "../config"
import { ETopicsTransaction } from "../types";

export default class Consumer {
    private _consumer;
    readonly topics;

    constructor(topics: ETopicsTransaction[]) {
        this._consumer = kafka.consumer({ groupId: config.KAFKA_GROUP_ID })
        this.topics = topics;
    }

    async connectAndSuscriber() {
        await this._consumer.connect()
        await this._consumer.subscribe({ topics: this.topics })     
    }

    async run(config: ConsumerRunConfig) {
        return await this._consumer.run(config);
    }

    async disconnect() {
        return await this._consumer.disconnect();
    }

    public get consumer() {
        return this._consumer;
    }
}