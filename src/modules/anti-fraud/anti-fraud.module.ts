import { Module, forwardRef } from '@nestjs/common';
import { AntiFraud } from './anti-fraud';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { serverConfigLoader } from '../config/loaders';
import { ServerConfigType } from '../config/types/server.type';
import { AntiFraudController } from './anti-fraud.controller';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule.forFeature(serverConfigLoader)],
        inject: [ConfigService],
        name: 'YAPE',
        useFactory: (config: ConfigService) => {
          const {
            kafka: { broker, groupId },
          } = config.get<ServerConfigType>('server');
          return {
            transport: Transport.KAFKA,
            options: {
              consumer: {
                groupId,
              },
              client: {
                brokers: [`${broker}`],
              },
            },
          };
        },
      },
    ]),
    forwardRef(() => TransactionModule),
  ],
  providers: [AntiFraud],
  controllers: [AntiFraudController],
  exports: [AntiFraud],
})
export class AntiFraudModule {}
