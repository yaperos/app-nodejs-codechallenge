import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { TransactionResponseDto } from '../transactions/dto/transaction-response.dto';

// Solo se cachean estados finales: nunca cambian, así que no hace falta invalidar
// y es imposible servir un "pending" desactualizado.
@Injectable()
export class TransactionCacheService implements OnModuleDestroy {
  private readonly logger = new Logger(TransactionCacheService.name);
  private readonly redis: Redis;
  private readonly ttlSeconds: number;
  private lastErrorLog = 0;

  constructor(config: ConfigService) {
    this.ttlSeconds = Number(config.get('CACHE_TTL_SECONDS', 86_400));
    // Sin cola offline y con timeout corto: si Redis cae se falla rápido y se va a la BD.
    this.redis = new Redis(config.getOrThrow<string>('REDIS_URL'), {
      enableOfflineQueue: false,
      commandTimeout: 100,
      maxRetriesPerRequest: 0,
    });
    this.redis.on('error', (error: Error) => this.logThrottled(error));
  }

  async get(id: string): Promise<TransactionResponseDto | null> {
    try {
      const raw = await this.redis.get(this.key(id));
      return raw ? (JSON.parse(raw) as TransactionResponseDto) : null;
    } catch (error) {
      this.logThrottled(error as Error);
      return null;
    }
  }

  async set(transaction: TransactionResponseDto): Promise<void> {
    try {
      await this.redis.set(
        this.key(transaction.transactionExternalId),
        JSON.stringify(transaction),
        'EX',
        this.ttlSeconds,
      );
    } catch (error) {
      this.logThrottled(error as Error);
    }
  }

  onModuleDestroy(): void {
    this.redis.disconnect();
  }

  private key(id: string): string {
    return `transaction:${id}`;
  }

  private logThrottled(error: Error): void {
    const now = Date.now();
    if (now - this.lastErrorLog > 10_000) {
      this.lastErrorLog = now;
      this.logger.warn(`Redis unavailable, using DB: ${error.message}`);
    }
  }
}
