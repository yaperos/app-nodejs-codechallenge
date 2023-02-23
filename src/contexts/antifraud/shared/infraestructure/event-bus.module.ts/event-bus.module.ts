import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'BUS',
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (configService: ConfigService) => {
                    return {
                        name: 'ANTIFRAUD_SERVICE',
                        transport: Transport.KAFKA,
                        options: {
                            client: {
                                clientId: 'transaction',
                                brokers: ['localhost:9092'],
                            },
                            consumer: {
                                groupId: 'transaction-consumer',
                            },
                            producer: {
                                createPartitioner:
                                    Partitioners.DefaultPartitioner,
                            },
                        },
                    };
                },
            },
        ]),
    ],
    exports: [ClientsModule],
})
class EventBusModule {}

export default EventBusModule;
