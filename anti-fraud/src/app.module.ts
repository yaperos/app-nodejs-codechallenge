import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ ConfigModule.forRoot({ isGlobal: true }),
  ClientsModule.register([
    {
      name: 'KAFKA',
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'anti-fraud',
          // brokers: [`${ process.env.KAFKA_HOST }:9092`]
          brokers: ['localhost:9092']
        },
        consumer: {
          groupId: 'anti-fraud-consumer'
        }
      }
    }
  ]) ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
