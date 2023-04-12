import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionStatus } from './entities/transactionStatus.entity';
import { TransactionType } from './entities/transactionType.entity';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Transaction, 
            TransactionType,
            TransactionStatus
        ]), 
        ClientsModule.registerAsync([
            {
              name: 'MS_ANTI_FRAUD',
              imports: [ConfigModule],
              useFactory: async (configService: ConfigService) => ({
                transport: Transport.KAFKA,
                options: {
                  client: {
                    clientId: 'ms-anti-fraud',
                    brokers: ['localhost:9092'],
                  },
                  consumer: {
                    groupId: 'ms-anti-fraud-consumer',
                  },
                },
              }),
              inject: [ConfigService],
            },
          ])
    ],
    controllers: [TransactionController],
    providers: [
        TransactionService,
        TransactionResolver
    ]
})
export class TransactionModule { }
