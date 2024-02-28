import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
    imports: [
        ClientsModule.register([{
            name:'KAFKA',
            transport: Transport.KAFKA,
            options:{
                client: {
                    ssl: false,
                    brokers: ['localhost:9092'],
                }
            }
        }])

    ],
    controllers: [],
    providers: [],
    exports: [
        ClientsModule.register([{
            name:'KAFKA',
            transport: Transport.KAFKA,
            options:{
                client: {
                    ssl: false,
                    brokers: ['localhost:9092'],
                }
            }
        }])
    ]
})
export class KafkaConfigModule { }