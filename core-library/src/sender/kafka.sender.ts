import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Client, ClientKafka } from "@nestjs/microservices";
import { microServiceKafka } from "../config/kafka.service";



@Injectable()
export class KafkaSender implements OnModuleInit{

    @Client(microServiceKafka)
    client: ClientKafka;

    @Inject()
    private logger: Logger

    onModuleInit() {
        this.logger = new Logger(KafkaSender.name);
    }

    async sendMessageToTopic(message : any, topic: string){

        this.logger.log(`:: Sending kafka message to ${topic}: ${JSON.stringify(message)}`);

        this.client.emit(topic, {message})
    }
}