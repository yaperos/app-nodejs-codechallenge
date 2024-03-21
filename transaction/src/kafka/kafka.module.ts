import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TRANSACTION_SERVICE, KAFKA_OPTIONS } from '../constants';

@Global()
@Module({
    imports: [
        ClientsModule.registerAsync({
            isGlobal: true,
            clients: [
                {
                    name: TRANSACTION_SERVICE,
                    useFactory: async(options) => ({ transport: Transport.KAFKA, options }),
                    inject: [KAFKA_OPTIONS],
                }
            ]
        })
    ],    
    providers: [
        {
            provide: KAFKA_OPTIONS,
            useFactory: async (configService: ConfigService) => configService.get('config.kafka.options'),
            inject: [ConfigService],
        }
    ],
    exports: [ClientsModule, KAFKA_OPTIONS]
})
export class KafkaModule {}
