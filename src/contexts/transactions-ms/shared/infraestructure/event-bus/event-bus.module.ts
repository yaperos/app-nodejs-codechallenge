import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'TRANSACTION_CREATED_SERVICE',
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
                        createPartitioner: Partitioners.DefaultPartitioner
                    }
                },
            },
        ]),
    ],
    exports: [ClientsModule],
})
class EventBusModule {}

export default EventBusModule;
