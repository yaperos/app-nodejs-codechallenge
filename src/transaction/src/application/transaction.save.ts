import { RequestDTO } from "../domain/entities"
import { IRepository } from "../domain/repository"
import { KafkaInstance } from "../infrastructure/kafka"
import { PRODUCER_TOPIC } from "../shared/config"
import { ValidationRequest } from "../shared/decorators/validation.decorator"
import { HttpResponse } from "../shared/dto"
import { HTTP_STATUS } from "../shared/enum"
import { ValidateRequest } from "./validation.request"

class TransactionSave {
    constructor(
        private readonly repository: IRepository,
        private readonly kafka: KafkaInstance
    ) { }

    @ValidationRequest(ValidateRequest)
    async run(payload: RequestDTO) {
        const { status, data, error } = await this.repository.transactionSave(payload)
        if (!status) return new HttpResponse(HTTP_STATUS.INTERNAL_ERROR, error)
        const messageSend = await this.kafka.producerMessage(PRODUCER_TOPIC, JSON.stringify(data))
        if (!messageSend) return new HttpResponse(HTTP_STATUS.INTERNAL_ERROR, error)
        return new HttpResponse(HTTP_STATUS.OK, {
            transactionExternalId: data['id']
        })
    }
}

export {
    TransactionSave
}