import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from './controllers/transactions.controller';
import { Transaction } from './entities/transaction.entity';
import { TransactionsService } from './services/transactions.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: 'ANTIFRAUD_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: process.env.KAFKA_CLIENT_ID,
            brokers: [process.env.KAFKA_BROKER],
          },
          consumer: {
            groupId: process.env.KAFKA_GROUP_ID,
          },
        },
      },
    ]),
    // ClientsModule.register([
    //   {
    //     name: 'HERO_SERVICE',
    //     transport: Transport.KAFKA,
    //     options: {
    //       client: {
    //         clientId: process.env.KAFKA_CLIENT_ID,
    //         brokers: [process.env.KAFKA_BROKER],
    //       },
    //       consumer: {
    //         groupId: process.env.KAFKA_GROUP_ID,
    //       },
    //     },
    //   }
    // ]),
    TypeOrmModule.forFeature([Transaction]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService]
})
export class TransactionsModule {}
