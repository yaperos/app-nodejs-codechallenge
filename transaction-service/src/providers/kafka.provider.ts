import { ClientProxyFactory } from '@nestjs/microservices';
import { KafkaConfig } from '../interfaces/kafka-config.interface';
import { Transport } from '@nestjs/microservices/enums';
import { ConfigService } from '@nestjs/config';

const ConfigKafkaProvider = {
  provide: process.env.KAFKA_PROVIDER,
  useFactory: (configService: ConfigService) => {
    const { host, port, clientId, groupId } =
      configService.get<KafkaConfig>('kafka');

    return ClientProxyFactory.create({
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: clientId,
          brokers: [`${host}:${port}`],
        },
        consumer: {
          groupId: groupId,
        },
      },
    });
  },
  inject: [ConfigService],
};

export default ConfigKafkaProvider;
