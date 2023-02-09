import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ClientsModule.register([{
      name: 'ANTIFRAUD_SERVICE',
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: process.env.KAFKA_CLIENT_ID,
          brokers: [process.env.KAFKA_BROKER],
        },
        consumer: {
          groupId: process.env.KAFKA_GROUP_ID,
        },
      },
    }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
