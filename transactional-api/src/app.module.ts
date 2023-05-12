import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from './api/api.module';
import { ServicesModule } from './application/services/services.module';
import { RepositoriesModule } from './infrastructure/repositories/repositories.module'
import { QueriesModule } from './application/queries/queries.module';
import { TransactionService } from './application/services/transaction/transaction.service';
import { TransactionController } from './api/transaction/transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './infrastructure/typeorm-config';
import { ConfigModule } from '@nestjs/config';
import { TransactionRepository } from './infrastructure/repositories/transaction/transaction.repository';
import { Transaction } from './domain/entities/transaction.entity';
import { TransactionQuery } from './application/queries/transaction/transaction.query';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.dev`]
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      imports: [ConfigModule],
    }),
    TypeOrmModule.forFeature([Transaction]),
    ClientsModule.register([{
      name: 'TRANSACTIONAL_EVENTS_SERVICE',
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'antifraud-worker',
          brokers: ['localhost:9092'],
        },
        consumer: {
          groupId: 'antifraud-worker-consumer',
        }
      }
    }])
  ],
  controllers: [
    AppController, 
    TransactionController
  ],
  providers: [
    AppService, 
    TransactionService,
    TransactionQuery,
    TransactionRepository
  ]
})
export class AppModule {}
