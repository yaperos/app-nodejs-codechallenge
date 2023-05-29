import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EventsModule } from './modules/events/events.module';

const configService = new ConfigService();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.register([
      {
        name: configService.get('KAFKA_NAME'),
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: configService.get('KAFKA_HOST_URL'),
            clientId: configService.get('KAFKA_CLIENT_ID'),
          },
          consumer: {
            groupId: configService.get('KAFKA_GROUP_ID'),
          },
        },
      },
    ]),
    EventsModule,
  ],
  providers: [],
})
export class AppModule {}
