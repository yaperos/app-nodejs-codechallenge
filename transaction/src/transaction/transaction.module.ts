import { CacheModule, CacheStore, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { redisStore } from 'cache-manager-redis-store';
import { TransactionService } from './application/services';
import { TransactionSchema } from './domain/entities/transaction.entity';
import { TransactionKey } from './domain/ports';
import { TransactionController } from './infrastructure/controllers/transaction.controller';
import { TransactionRepository } from './infrastructure/repository';

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
        name: 'SECURITY_CLIENT',
        transport: Transport.KAFKA,
        options: {
          consumer: {
            groupId: 'security-consumer',
          },
          client: {
            brokers: ['localhost:9092'],
            clientId: 'security',
          },
        },
      },
    ]),
    MongooseModule.forFeature([
      { name: TransactionKey.TRANSACTION_SCHEMA, schema: TransactionSchema },
    ]),
  ],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    { useClass: TransactionRepository, provide: 'REPOSITORY' },
  ],
})
export class TransactionModule {}
