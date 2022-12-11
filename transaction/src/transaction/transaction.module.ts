import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { ClientsModule, Transport } from "@nestjs/microservices";
import { KnexDatabaseService } from 'src/database/knex/knex-database.service';
import { KnexModule } from 'nest-knexjs';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionReadEntity, TransactionSchema } from './model/mongoose/transaction-read.entity';
import { TransactionReadRepository } from './repository/transaction-read.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forFeature([{ name: TransactionReadEntity.name, schema: TransactionSchema }]),
    KnexModule.forRoot({
        config: {
          client: process.env.KNEX_CLIENT,
          version: process.env.KNEX_VERSION,
          connection: {
            host: process.env.KNEX_CONNECTION_HOST,
            user: process.env.KNEX_CONNECTION_USER,
            password: process.env.KNEX_CONNECTION_PASSWORD,
            database: process.env.KNEX_CONNECTION_DATABASE,
            ssl: {
              rejectUnauthorized: false
            }
          },
        },
    }),
    ClientsModule.register([
      {
        name: process.env.KAFKA_EMITTER_NAME,
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [process.env.KAFKA_BROKER],
          },
          consumer: {
            groupId: process.env.KAFKA_CONSUMER_GROUP,
          },
        },
      },
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, KnexDatabaseService, TransactionReadRepository],
  exports: []
})
export class TransactionModule {}
