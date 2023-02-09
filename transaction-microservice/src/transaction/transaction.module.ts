import { CacheModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices/enums';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from 'src/database/entities';
import { IKafkaConfig } from 'src/interfaces/kafka-config.interface';
import { CacheConfigService } from '../services';
import { DataLoaderService } from './services/data-loader.service';
import { TransactionService } from './services/transaction.service';
import { TransactionResolver } from './transaction.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, TransactionStatus, TransactionType]),
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
  ],
  providers: [
    {
      provide: 'YAPE_SERVICE',
      useFactory: (configService: ConfigService) => {
        const { host, port } = configService.get<IKafkaConfig>('kafka');
        return ClientProxyFactory.create({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'yape',
              brokers: [`${host}:${port}`],
            },
            consumer: {
              groupId: 'yape-consumer',
            },
          },
        });
      },
      inject: [ConfigService],
    },
    DataLoaderService,
    TransactionService,
    TransactionResolver,
  ],
  exports: [DataLoaderService],
})
export class TransactionModule {}
