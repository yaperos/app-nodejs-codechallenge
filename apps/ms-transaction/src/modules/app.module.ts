import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionController } from 'src/controllers/transaction.controller';
import { TransactionEntity } from 'src/entities/transaction.entity';
import { TransactionService } from 'src/services/transaction.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name:'ANTIFRAUD-CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'antifraud',
            brokers: ['localhost:9092']
          },
          consumer: {
            groupId: 'ms-transaction-consumer',
          }
        }
      }
    ]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'codechallenge',
      entities: [TransactionEntity],
      synchronize: true
    }),
    TypeOrmModule.forFeature([TransactionEntity]),

  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class AppModule {}
