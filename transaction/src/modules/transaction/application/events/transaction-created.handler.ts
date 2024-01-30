import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { TransactionCreatedEvent } from "../../domain/events/transaction-created.event";
import { TransactionRepository } from "../../domain/repositories/transaction.repository";
import { TransactionInfrastructure } from "../../infrastructure/transaction.infrastructure";
import { Inject } from "@nestjs/common";
import { TransactionDoc } from "../../infrastructure/entities/transaction-doc.entity";
import { AppService } from "src/app.service";
import { ClientKafka } from "@nestjs/microservices";
import { TransactionKafkaService } from "../../infrastructure/services/transaction-kafka.service";

@EventsHandler(TransactionCreatedEvent)
export class TransactionCreatedHandler implements IEventHandler<TransactionCreatedEvent> {
    constructor(@Inject(TransactionInfrastructure) private readonly repository: TransactionRepository,
        private readonly transactionKafkaService: TransactionKafkaService) { }

    async handle(event: TransactionCreatedEvent) {
        const doc = new TransactionDoc()
        doc.transactionId = event.transactionId
        doc.transactionStatus = { name: event.status }
        doc.transactionType = { name: event.transferTypeName }
        doc.value = event.value
        doc.createdAt = event.createdAt
        await this.repository.save_doc(doc)

        this.transactionKafkaService.sentTransaction(event.transactionId, event.value)

        //this.client.emit(AppService.kafka_topic, { key: event.transactionId, value: { value: event.value, transactionId: event.transactionId } })
    }
}