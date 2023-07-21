import { ConfigService } from "@nestjs/config";
import { ClientsModule, Transport, ClientProvider } from "@nestjs/microservices";


export const KAFKA_NAME = "TRANSACION_SERVICE"
export const KAFKA_TOPIC = "transaction_created"
export const getKafkaParameters =(config: ConfigService): ClientProvider => {
    // const kafka = config.get<any>('kafka')
    return {
        transport: Transport.KAFKA,
        options: {
            client: {
                clientId: process.env.KAFKA_CLIENT_ID,
                brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`]
            },
            consumer: {
                groupId: process.env.KAFKA_GROUP_ID
            }
        }
    }
}  
export const KafkaClientModule = ClientsModule.registerAsync([
    {
        name: KAFKA_NAME,
        useFactory: getKafkaParameters
        

    }
])