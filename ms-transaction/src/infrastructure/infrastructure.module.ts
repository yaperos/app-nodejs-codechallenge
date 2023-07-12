import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { ConfigModule } from './config.module';
import { ConfigService } from './config.service';
import { TransactionController } from './controllers/transaction.controller';
import { ApplicationModule } from '../application/application.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({})
export class InfrastructureModule {
  static foorRoot(): DynamicModule {
    return {
      module: InfrastructureModule,
      imports: [
        ApplicationModule,
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useClass: TypeOrmConfigService,
          inject: [ConfigService],
        }),
        ClientsModule.register([
          {
            name: 'TRANSACTION_MICROSERVICE',
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: 'transaction-microservice',
                brokers: [
                  `${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`,
                ],
              },
              producerOnlyMode: true,
              consumer: {
                groupId: 'transaction-consumer',
              },
            },
          },
        ]),
      ],
      controllers: [TransactionController],
    };
  }
}
