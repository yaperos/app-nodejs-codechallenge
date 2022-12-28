import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import {ClientsModule, Transport} from "@nestjs/microservices";

const controllers = [AppController];
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
    }),
    ClientsModule.register([
      {
        name: 'ANTI_FRAUD_EMITTER',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'anti-fraud-microservice-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [...controllers],
  providers: [AppService],
})
export class AppModule {}
