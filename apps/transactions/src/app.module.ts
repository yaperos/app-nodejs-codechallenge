import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsController } from './transactions/transactions.controller';
import { TransactionsService } from './transactions/transactions.service';
import { DatabaseModule } from '@app/common/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ALL_TABLES } from '@app/common/database/tables';
import { TransactionRespository } from '@app/common/database/models/repositories';
import { TransactionDAO } from '@app/common/database/models/dao';
import { TransactionsUseCase } from './transactions/transactions.usecase';
import { APP_PIPE } from '@nestjs/core';
import { KafkaModule } from './kafka/kafka.module';
import { CLIENT_KAFKA } from './transactions/transactions.constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    TypeOrmModule.forFeature(ALL_TABLES),
    KafkaModule.registerAsync({
      clientId: CLIENT_KAFKA.ID_TRANSACTION,
      brokers: [process.env.KAFKA_URL],
      groupId: 'test-app-group',
    }),
  ],
  controllers: [AppController, TransactionsController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    AppService,
    TransactionsUseCase,
    TransactionsService,
    TransactionRespository,
    TransactionDAO,
  ],
})
export class AppModule {}
