import {AntiFraudService} from "../../Domain/Services/AntiFraudService";
import {MessageTransactionModel} from "../../Domain/Models/MessageTransactionModel";
import {EventPublishInterface} from "../../Domain/Interfaces/EventPublishInterface";
import {EventConsumerInterface} from "../../Domain/Interfaces/EventConsumerInterface";

export class ValidateAntiFraudUseCase {
    constructor(
        private readonly eventConsumer: EventConsumerInterface,
        private readonly eventPublish: EventPublishInterface,
        private readonly antiFraudService: AntiFraudService
    ) {}

    async execute(): Promise<void> {
        await this.eventConsumer.consumer(async (transaction: MessageTransactionModel): Promise<void>  => {
            const validation = this.antiFraudService.validate(transaction);
            await this.eventPublish.publish(validation);
        });
    }
}
