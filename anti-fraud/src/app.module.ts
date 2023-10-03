import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CachingModule } from './caching/caching.module';


@Module({
  imports: [
    CachingModule,
    ClientsModule.register([
      {
        name: 'TRANSACTIONS-SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transactions',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'transactions-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
