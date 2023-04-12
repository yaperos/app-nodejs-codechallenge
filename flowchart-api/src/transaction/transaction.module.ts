import {Module} from '@nestjs/common';
import {TransactionService} from './transaction.service';
import {TransactionController} from './transaction.controller';
import {PrismaModule} from "../prisma/prisma.module";
import {ClientKafka, ClientsModule, Transport} from "@nestjs/microservices";

@Module({
    imports: [PrismaModule,
        ClientsModule.register([
            {
                name: process.env.KAFKA_SERVICE,
                transport: Transport.KAFKA,
                options: {
                    client: {
                        brokers: [process.env.KAFKA_BROKER],
                    },
                    consumer: {
                        groupId: process.env.KAFKA_GROUP,
                    },
                },
            },
        ])],
    controllers: [TransactionController],
    providers: [TransactionService,
        {
            provide: process.env.KAFKA_PRODUCER,
            useFactory: async (kafkaService: ClientKafka) => {
                return kafkaService.connect();
            },
            inject: [process.env.KAFKA_SERVICE],
        }]
})
export class TransactionModule {
}
