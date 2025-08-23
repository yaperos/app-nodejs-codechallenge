import {Injectable} from "@nestjs/common";
import {TransactionEventInterface} from "../../../Domain/Events/TransactionEventInterface";
import {KafkaService} from "../Services/KafkaService";
import {Transaction} from "../../../Domain/Entities/Transaction";
import {UpdateTransactionStatusUseCase} from "../../../Application/UseCases/UpdateTransactionStatusUseCase";
import {MessageStatusInterface} from "../../../Domain/Interfaces/MessageStatusInterface";

@Injectable()
export class KafkaTransactionEvent implements TransactionEventInterface {
    constructor(
        private readonly kafkaService: KafkaService,
        private readonly updateTransactionStatusUseCase: UpdateTransactionStatusUseCase,
    ) {}

    async publishTransactionCreated(transaction: Transaction): Promise<void> {
        await this.kafkaService.publisher('transaction.created', {
            transactionExternalId: transaction.id,
            value: transaction.value,
        });
    }

    async subscribeTransactionCreated(): Promise<void> {
        await this.kafkaService.subscribe('transaction.updated', async (messageBroker: object): Promise<void> => {
            const message = messageBroker as MessageStatusInterface;
            await this.updateTransactionStatusUseCase.execute(
                message.transactionExternalId,
                message.status,
            );
        });
    }
}
