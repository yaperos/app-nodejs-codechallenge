import { ConfigService } from "@nestjs/config";
import { ClientsModule, Transport, ClientProvider } from "@nestjs/microservices";
import { configLoader } from "../config/config-loader";

export const KAFKA_NAME = "TRANSACION_SERVICE"
export const KAFKA_TOPIC = "transaction_created"
const kafka = configLoader().kafka
export const getKafkaParameters =(config: ConfigService): ClientProvider => {
    
    return {
        transport: Transport.KAFKA,
        options: {
            client: {
                clientId: kafka.client_id,
                brokers: ["kafka:9092"]
            },
            consumer: {
                groupId: kafka.group_id
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