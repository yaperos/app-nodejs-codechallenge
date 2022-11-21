import { BaseUseCase } from "../../../../Contexts/Shared/application/BaseUseCase";
import { ApplicationError } from "../../../../Contexts/Shared/domain/ApplicationError";
import { KafkaEvents } from "../infrastructure/kafka/KafkaEvents";

export interface Request {
    topic: string;
    data: any;
}

export class PublishEvent extends BaseUseCase<any, Promise<any> | ApplicationError> {
    constructor(private kafka: KafkaEvents) {
        super();
    }
    public async run(request: Request): Promise<any> {
        await this.kafka.publish(request.topic, request.data)
    }
}