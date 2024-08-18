import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from './controllers/transactions.controller';
import { TransactionMapper } from './mappers/transaction.mapper';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionRepository } from './repositories/transaction.repository';
import { TransactionsService } from './services/transactions.service';
import { KafkaService } from './services/kafka.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { JwtStrategy } from './providers/jwt-strategy.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]),
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      entities: [TransactionEntity],
    }),

    ClientsModule.register([
      {
        name: 'TRANSACTION_KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'ms-transaction-consumer',
          },
          producer: {
            createPartitioner: Partitioners.LegacyPartitioner,
          },
        },
      },
    ]),
  ],
  controllers: [TransactionsController],
  providers: [
    TransactionRepository,
    TransactionMapper,
    TransactionsService,
    KafkaService,
    JwtStrategy
  ],
})
export class AppModule {}
