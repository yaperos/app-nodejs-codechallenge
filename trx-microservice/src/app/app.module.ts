import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import postgresConfig from '../infrastructure/config/database/postgres.config'
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { ApplicationModule } from '../application/application.module';
import { TransactionApiModule } from './api/transactions/transactions.module';
import kafkaConfig from '../infrastructure/config/messaging/kafka.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [postgresConfig, kafkaConfig]
    }),
    InfrastructureModule,
    ApplicationModule,
    TransactionApiModule
  ]
})
export class AppModule {}
