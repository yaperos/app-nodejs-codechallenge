import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { KafkaService } from 'nestjs-rdkafka/dist/kafka/services/kafka.service';
import { KafkaModule } from 'nestjs-rdkafka/dist/kafka/kafka.module';
const configService = new ConfigService();
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CLIENT_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'billing',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'client-consumer',
          },
        },
      },
    ]),
  
    ConfigModule.forRoot({
      envFilePath: [`config/${process.env.environment || ''}.env`]
    }),
    KafkaModule.forRootAsync({
      producer: {
        conf: {
          'bootstrap.servers': configService.get('bootstrap.servers'),
          'security.protocol': configService.get('security.protocol'),
          'sasl.mechanisms': configService.get('sasl.mechanisms'),
          'sasl.username': configService.get('sasl.username'),
          'sasl.password': configService.get('sasl.password'),
        }
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
