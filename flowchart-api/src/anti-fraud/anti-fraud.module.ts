import {Module} from '@nestjs/common';
import {AntiFraudService} from './anti-fraud.service';
import {AntiFraudController} from './anti-fraud.controller';
import {ClientKafka, ClientsModule, Transport} from "@nestjs/microservices";

@Module({
    imports: [
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
        ])
    ],
    controllers: [AntiFraudController],
    providers: [AntiFraudService,
        {
            provide: process.env.KAFKA_CONSUMER,
            useFactory: async (kafkaService: ClientKafka) => {
                return kafkaService.connect();
            },
            inject: [process.env.KAFKA_SERVICE],
        }]
})
export class AntiFraudModule {
}
