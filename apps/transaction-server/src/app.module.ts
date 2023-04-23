import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AntiFraudReceiverModule } from './anti-fraud-receiver/anti-fraud-receiver.module';
import { ConfigModule } from '@nestjs/config';
import { TransactionModule } from './transaction/transaction.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import config from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot(
      {
        load : [config],
        isGlobal : true,
        envFilePath : '.env'
      }
    ),
    AntiFraudReceiverModule,
    TransactionModule,
    PrismaModule,
    RedisModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
