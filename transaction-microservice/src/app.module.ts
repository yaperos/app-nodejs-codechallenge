import { Module } from '@nestjs/common';
import { EnvironmentConfigModule } from './infrastructure/config/environment-config/environment-config.module';
import { ExceptionsModule } from './infrastructure/exceptions/exceptions.module';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { GraphQLConfigModule } from './infrastructure/config/graphql/graphql.module';
import { ServicesModule } from './infrastructure/services/services.module';

@Module({
  imports: [
    LoggerModule,
    ExceptionsModule,
    EnvironmentConfigModule,
    GraphQLConfigModule,
    ServicesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
