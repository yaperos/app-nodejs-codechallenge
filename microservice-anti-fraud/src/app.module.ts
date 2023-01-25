import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { ClientsModule } from '@nestjs/microservices/module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot(
      {
        envFilePath: '.env',
      }
    ),
    ClientsModule.register([
      {
        name: 'ANTIFRAUD_MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'anti-fraud',
            brokers: [process.env.KAFKA_BROKER],
          },
          consumer: {
            groupId: 'anti-fraud-consumer',
          }
        }
      }
    ])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
