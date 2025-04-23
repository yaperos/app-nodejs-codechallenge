import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { TransactionModule } from './transactions/transaction.module';
import { DatabaseModule } from './database/database.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TransactionModule,
    DatabaseModule,
    KafkaModule
  ],
  controllers: [],
  providers: [Logger],
})
export class AppModule { }
