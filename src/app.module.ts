import { MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { EnvironmentConfigModule } from './transaction/infraestructures/config/environment-config/config.module';
import { TransactionModule } from './transaction/presentations/transaction/transaction.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from 'libs/DatabaseModule';
import { RequestStorageMiddleware } from 'libs/RequestStorageMiddleware';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ProducerService } from './producer.service';
//import { redisStore } from 'cache-manager-redis-store'



@Module({
  imports: [  
    /*
    ClientsModule.register([
      {
        name:'KAFKA_SERVICE',
        transport:Transport.KAFKA,
        options: {
          client:{
            brokers: ['localhost:9092']
          },
          consumer: {
            groupId:'servicio'                    
          }
        }
      }
    ]),*/      
            EnvironmentConfigModule, DatabaseModule,ThrottlerModule.forRoot(),
            ScheduleModule.forRoot(), TransactionModule],
  controllers: [AppController] ,
  providers: [ ProducerService, AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
  ],  
})
export class AppModule implements NestModule 
{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestStorageMiddleware).forRoutes('*');
  }  
} 
