import { MessagingModule } from '@app/messaging';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InitSchema1727700000000 } from './database/migrations/1727700000000-init-schema';
import { IdempotencyKeys1727710000000 } from './database/migrations/1727710000000-idempotency-keys';
import { OutboxMessage } from './outbox/outbox-message.entity';
import { IdempotencyKey } from './transactions/entities/idempotency-key.entity';
import { Transaction } from './transactions/entities/transaction.entity';
import { TransferType } from './transactions/entities/transfer-type.entity';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MessagingModule.forRoot('transaction-service'),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.getOrThrow<string>('DATABASE_URL'),
        entities: [Transaction, TransferType, OutboxMessage, IdempotencyKey],
        // Las migraciones se registran como clases porque webpack empaqueta el código.
        migrations: [InitSchema1727700000000, IdempotencyKeys1727710000000],
        migrationsRun: true,
        synchronize: false,
        extra: { max: Number(config.get('DB_POOL_SIZE', 20)) },
      }),
    }),
    TransactionsModule,
  ],
})
export class TransactionModule {}
