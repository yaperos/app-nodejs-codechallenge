import { ConfigService } from "@nestjs/config";
import { KafkaConfig } from "src/config/config";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";

const KafkaClient = {
    provide: "KAFKA_CLIENT",
    useFactory: (configService: ConfigService) => {
        const config = configService.get<KafkaConfig>("kafka");

        return ClientProxyFactory.create({
            transport: Transport.KAFKA,
            options: {
                client: {
					clientId: "transactions_api",
                    brokers: [config.broker],
                },
                consumer: {
                    groupId: config.groupId,
                },
            },
        });
    },
    inject: [ConfigService],
};

export default KafkaClient;
