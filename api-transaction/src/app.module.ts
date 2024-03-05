import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomConfigModule } from './common/config/custom-config';
import { CustomGraphQLModule } from './common/config/custom-graphql';
import { TypeOrmConfigService, TypeOrmDatabaseModule } from './common/config/database';
import { TransactionKafkaConfigService } from './common/config/kafka';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    CustomConfigModule,
    CustomGraphQLModule,
    TypeOrmDatabaseModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService, TypeOrmConfigService, TransactionKafkaConfigService],
})
export class AppModule { }
