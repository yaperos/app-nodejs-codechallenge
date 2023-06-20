import EventUseCase from "../../application/event.UseCase";
import EventEntity from "../../domain/event.entity";
import { KafkaQueue } from "../config/queue/kafka"
import Logger from "../config/logger/winston"
import { Consumer, EachMessagePayload } from "kafkajs";

export interface SimpleConsumer {
    connect(): Promise<void>;
    handle(message: any): Promise<void>
    disconnect(): Promise<void>;
}


export default class EventConsumer implements SimpleConsumer {
    private readonly queue: KafkaQueue = new KafkaQueue();
    private consumer: Consumer;

    constructor(private useCase: EventUseCase, private topics: string[]) {
        Logger.info(`Creating queue processor`)
        this.consumer = this.queue.getConsumer()
    }

    connect = async (): Promise<void> => {
        Logger.info(`Starting consumer ${this.topics}`)
        return this.consumer.connect()
            .then(() => {
                Logger.info(`Consumer connected ${this.topics}`)
                this.consumer.subscribe({topics: this.topics, fromBeginning: true})
            }).then(() => {
                Logger.info(`Consumer start running ${this.topics}`)
                this.consumer.run({
                    eachMessage: (payload) => this.handle(payload)
                })
            }).catch(e => {
                Logger.error(`Error on connecting consumer ${e.message}`)
            })
    }

    handle = async({ topic ,message }: EachMessagePayload): Promise<void> => {
        if(message.value === null){
            return
        }
        
        const data = message.value.toString()
        const value: EventEntity = JSON.parse(data);
        Logger.debug(`Message received ${data} on topic ${topic}`)
        this.useCase.updateTransaction(value.transactionExternalId, topic)
    }

     disconnect= async(): Promise<void> => {
        return this.consumer.disconnect().catch(e => {
            Logger.error(`Error on disconnecting consumer ${e.message}`)
        })
    }
}