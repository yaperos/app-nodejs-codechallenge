import { Inject, Injectable } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { ResponseTransaction } from "src/transactions/dto/response-transaction";
import { KAFKA_NAME, KAFKA_TOPIC } from "./Kafka";
import { configLoader } from "../config/config-loader";
@Injectable()
export class KafkaService {
    constructor(@Inject(KAFKA_NAME) private readonly _kafka: ClientKafka){

    }

    async onModuleInit() {
        const requestPatterns = [
            KAFKA_TOPIC
        ];

        requestPatterns.forEach(pattern => {
            this._kafka.subscribeToResponseOf(pattern);
        })

        await this._kafka.connect()
    }


    async onModuleDestroy(){
        await this._kafka.close();
    }

    async antifraudService(data: any): Promise<any> {
        return await this._kafka.send(KAFKA_TOPIC, JSON.stringify(data)).toPromise();
    }
}