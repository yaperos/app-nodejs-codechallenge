import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'yape-consumer',
            brokers: ['localhost:9092'],
          },
          producer: {
            createPartitioner: Partitioners.LegacyPartitioner,
          },
        },
      },
    ]),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}