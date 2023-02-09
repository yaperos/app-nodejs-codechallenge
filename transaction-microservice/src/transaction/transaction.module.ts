import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices/enums';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionStatus } from 'src/database/entities/transaction-status.entity';
import { Transaction } from 'src/database/entities/transaction.entity';
import { TransactionType } from 'src/database/entities/transaction.type.entity';
import { IKafkaConfig } from 'src/interfaces/kafka-config.interface';
import { DataLoaderService } from './services/data-loader.service';
import { TransactionService } from './services/transaction.service';
import { TransactionResolver } from './transaction.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, TransactionStatus, TransactionType]),
  ],
  providers: [
    {
      provide: 'YAPE_SERVICE',
      useFactory: (configService: ConfigService) => {
        console.log(configService.get('kafka'));
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
