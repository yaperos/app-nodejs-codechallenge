import { Module } from '@nestjs/common';
import { TransactionController } from './controllers/transaction.controller';
import { TransactionService } from './services/transaction.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionStatus } from './entities/transaction-status.entity';
import { TransactionType } from './entities/transaction-type.entity';
import { Transaction } from './entities/transaction.entity';
import { TransactionStatusService } from './services/transaction-status.service';
import { TransactionTypeService } from './services/transaction-type.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST', 'localhost'),
        port: +configService.get('POSTGRES_PORT', '3306'),
        username: configService.get('POSTGRES_USER', 'postgres'),
        password: configService.get('POSTGRES_PASSWORD', 'postgres'),
        database: configService.get(
          'POSTGRES_DATABASE',
          'app-nodejs-codechallenge',
        ),
        autoLoadEntities: true,
        entities: ['dist/**/*.entity{.ts,.js}'],
        logging: configService.get('POSTGRES_LOGGING') === 'true',
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Transaction, TransactionType, TransactionStatus]),
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'anti-fraud-ms',
            brokers: ['localhost:9092'],
          },
          producer: {
            allowAutoTopicCreation: true,
          },
          consumer: {
            groupId: 'anti-fraud-consumer-group',
          },
        },
      },
    ]),
  ],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    TransactionStatusService,
    TransactionTypeService,
  ],
})
export class TransactionMsModule {}
