import { MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { EnvironmentConfigModule } from './transaction/infraestructures/config/environment-config/config.module';
import { TransactionModule } from './transaction/transaction.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from 'libs/DatabaseModule';
import { RequestStorageMiddleware } from 'libs/RequestStorageMiddleware';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { KafkaModule } from 'libs/KafkaModule';
import { Config } from 'src/Config';
//import { redisStore } from 'cache-manager-redis-store'



@Module({
  imports: [  EnvironmentConfigModule, DatabaseModule,ThrottlerModule.forRoot(),
              ScheduleModule.forRoot(), KafkaModule.register(Config.BROKER),TransactionModule],
  controllers: [AppController] ,
  providers: [ AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],  
})
export class AppModule implements NestModule 
{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestStorageMiddleware).forRoutes('*');
  }  
} 
