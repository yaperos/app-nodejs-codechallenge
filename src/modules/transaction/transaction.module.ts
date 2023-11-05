import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionRepository } from './repository/transaction.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { serverConfigLoader } from '../config/loaders';
import { ServerConfigType } from '../config/types/server.type';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]),
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
  ],
  providers: [TransactionService, TransactionRepository],
  controllers: [TransactionController],
})
export class TransactionModule {}
