import { Module } from '@nestjs/common';
import {PrismaService} from "./Infraestructure/Persistence/Prisma/Services/PrismaService";
import {TransactionController} from "./Infraestructure/Controllers/TransactionController";
import {KafkaService} from "./Infraestructure/Kafka/Services/KafkaService";
import {CreateTransactionUseCase} from "./Application/UseCases/CreateTransactionUseCase";
import {GetTransactionUseCase} from "./Application/UseCases/GetTransactionUseCase";
import {UpdateTransactionStatusUseCase} from "./Application/UseCases/UpdateTransactionStatusUseCase";
import {
    PrismaTransactionRepository
} from "./Infraestructure/Persistence/Prisma/Repositories/PrismaTransactionRepository";
import {TransactionStatusController} from "./Infraestructure/Controllers/TransactionStatusController";
import {KafkaTransactionEvent} from "./Infraestructure/Kafka/Events/KafkaTransactionEvent";

@Module({
    controllers: [TransactionController],
    providers: [
        PrismaService,
        KafkaService,
        TransactionStatusController,
        {
            provide: 'TransactionRepositoryInterface',
            useClass: PrismaTransactionRepository,
        },
        {
            provide: 'TransactionEventInterface',
            useClass: KafkaTransactionEvent,
        },
        CreateTransactionUseCase,
        GetTransactionUseCase,
        UpdateTransactionStatusUseCase,
    ],
})
export class TransactionModule {}
