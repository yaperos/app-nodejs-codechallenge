import { ConfigService } from "@nestjs/config";
import { ClientProvider, ClientsModule, Transport } from "@nestjs/microservices";
import { Kafka } from "../transaction/constants/kafka.enum";

export const kafkaFactory = (config: ConfigService): ClientProvider => {
    const host = config.get<string>('KAFKA_HOST');
    const port = config.get<number>('KAFKA_PORT');

    return {
        transport: Transport.KAFKA,
        options: {
            subscribe: {
                fromBeginning: true,
            },
            client: {
                clientId: Kafka.CONSUMER_CLIENTID,
                brokers: [`${host}:${port}`],
            },
            consumer: {
                groupId: Kafka.CONSUMER_GROUP_ID,
            },
        },
    };
};

export const ConfigKafkaClientModule = ClientsModule.registerAsync([
    {
      name: Kafka.INSTANCE_NAME,
      useFactory: kafkaFactory,
      inject: [ConfigService],
    },
  ]);
