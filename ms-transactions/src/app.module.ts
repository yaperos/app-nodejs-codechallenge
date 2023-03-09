import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Transaction } from './entities/transaction.entity';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ANTIFRAUD_MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'antifraud',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'transaction-consumer'
          },
          producer: {
            createPartitioner: Partitioners.LegacyPartitioner
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
      database: 'db-transactions',
      entities: [Transaction],
      migrations: ['dist/migrations/*.{ts,js}'],
      synchronize: true,
      migrationsTableName: 'typeorm_migrations',
    }),
    TypeOrmModule.forFeature([Transaction])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
