import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([{
      name: process.env.KAFKA_NAME,
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.KAFKA_HOST],
        },
      }
    }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
