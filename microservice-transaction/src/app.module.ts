import { Module } from '@nestjs/common';
import { EnvironmentConfigModule } from './infrastructure/config/environment-config/environment-config.module';
import { PrismaModule } from './infrastructure/config/prisma/prisma.module';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { ExceptionsModule } from './infrastructure/exceptions/exceptions.module';
import { RepositoriesModule } from './infrastructure/repositories/repositories.module';
import { KafkaModule } from './infrastructure/kafka/kafka.module';
import { UsecasesProxyModule } from './infrastructure/usecases_proxy/usecases-proxy.module';
import { ControllersModule } from './infrastructure/controllers/controllers.module';

@Module({
  imports: [
    EnvironmentConfigModule,
    PrismaModule,
    LoggerModule,
    ExceptionsModule,
    RepositoriesModule,
    KafkaModule,
    UsecasesProxyModule.register(),
    ControllersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
