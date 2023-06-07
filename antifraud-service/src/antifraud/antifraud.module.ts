import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigurationModule } from "src/config/config.module";
import { ConfigService } from "src/config/config.service";
import { KafkaMessageBrokerEvent } from "./infraestructure/adapters/in/events/kafka-message-broker.adapter";
import { APP_FILTER } from "@nestjs/core";
import { ValidateTransactionUseCase } from "./application/validate-transaction.usecase";
import { HttpErrorFilter } from "./application/exceptions/http-error.filter";
import { KafkaEventMessageAdapter } from "./infraestructure/adapters/out/kafka-event-message.adapter";

@Module({
    imports: [
        ConfigurationModule,
        ClientsModule.registerAsync([
            {
                name: 'KAFKA_ANTIFRAUD_SERVICE',
                imports: [ConfigurationModule],
                useFactory: async (configService: ConfigService) => ({
                    transport: Transport.KAFKA,
                    options: {
                        client: {
                            brokers: [configService.get('KAFKA_BROKER')],
                        }
                    }
                }),
                inject: [ConfigService],
            }
        ])
    ],
    controllers: [
        KafkaMessageBrokerEvent
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: HttpErrorFilter,
        },
        ValidateTransactionUseCase,
        KafkaEventMessageAdapter

    ],
})
export class AntifraudModule { }