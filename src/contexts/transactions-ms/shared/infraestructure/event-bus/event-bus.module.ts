import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'TRANSACTION_CREATED_SERVICE',
                transport: Transport.KAFKA,
                options: {
                    client: {
                        clientId: 'transaction',
                        brokers: ['kafka:9092'],
                    },
                    consumer: {
                        groupId: 'transaction-consumer',
                    },
                },
            },
        ]),
    ],
    exports: [ClientsModule],
})
class EventBusModule {}

export default EventBusModule;
