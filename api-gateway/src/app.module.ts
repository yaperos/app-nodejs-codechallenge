import { CacheModule, CacheStore, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { redisStore } from 'cache-manager-redis-store';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => {
        const store = await redisStore({
          socket: {
            host: 'localhost',
            port: 6379,
          },
        });
        return {
          store: store as unknown as CacheStore,
        };
      },
    }),
    ClientsModule.register([
      {
        name: 'TRANSACTION_CLIENT',
        transport: Transport.KAFKA,
        options: {
          consumer: {
            groupId: 'transaction-consumer',
            sessionTimeout: 300000,
            retry: { retries: 30 },
          },
          client: {
            brokers: ['localhost:9092'],
            clientId: 'transaction-1',
          },
        },
      },
      {
        name: 'TRANSACTION_QUERY',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 8080,
        },
      },
    ]),
    // KafkaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
