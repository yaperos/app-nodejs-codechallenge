import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CacheModule } from 'apps/shared/cache/cache.module';
import { CacheAdminController } from 'apps/shared/cache/cache-admin.controller';
import { PrismaModule } from './prisma.module';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  imports: [
    CacheModule,
    PrismaModule,
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'transaction-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [TransactionController, CacheAdminController],
  providers: [TransactionService],
})
export class TransactionModule { }
