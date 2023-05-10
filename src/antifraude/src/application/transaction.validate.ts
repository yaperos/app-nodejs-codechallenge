import { Transaction } from "../domain/entities"
import { KafkaInstance } from "../infrastructure/kafka"
import { PRODUCER_TOPIC } from "../shared/config"

class TransactionValidate {
    constructor(
        private readonly kafka: KafkaInstance
    ) { }

    async run(payload: Transaction): Promise<boolean> {
        this.kafka.producerMessage(PRODUCER_TOPIC,JSON.stringify({
            ...payload,
            stateId: payload.value > 1000 ? 3: 2
        }))
        return true
    }
}

export {
    TransactionValidate
}