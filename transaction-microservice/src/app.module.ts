import { Module } from '@nestjs/common';
import { EnvironmentConfigModule } from './infrastructure/config/environment-config/environment-config.module';
import { ExceptionsModule } from './infrastructure/exceptions/exceptions.module';
import { LoggerModule } from './infrastructure/logger/logger.module';

@Module({
  imports: [
    
    LoggerModule,
    ExceptionsModule,
    EnvironmentConfigModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
