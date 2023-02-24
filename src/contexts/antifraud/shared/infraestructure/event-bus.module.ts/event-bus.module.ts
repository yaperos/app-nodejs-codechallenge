import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'ANTIFRAUD_SERVICE',
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (configService: ConfigService) => {
                    return {
                        name: 'ANTIFRAUD_SERVICE',
                        transport: Transport.KAFKA,
                        options: {
                            client: {
                                clientId: configService.get('CLIENT_ID'),
                                brokers: [configService.get('BROKER')],
                            },
                            consumer: {
                                groupId: configService.get('CONSUMER_GROUP_ID'),
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
