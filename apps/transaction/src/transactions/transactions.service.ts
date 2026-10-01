import {
  Topics,
  TransactionCreatedEvent,
  TransactionStatus,
  type FinalTransactionStatus,
} from '@app/contracts';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash, randomUUID } from 'node:crypto';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { TransactionCacheService } from '../cache/transaction-cache.service';
import { OutboxMessage } from '../outbox/outbox-message.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { IdempotencyKey } from './entities/idempotency-key.entity';
import { Transaction } from './entities/transaction.entity';
import { TransferType } from './entities/transfer-type.entity';
import { toTransactionResponse } from './transaction.mapper';

export interface CreateResult {
  transaction: Transaction;
  replayed: boolean;
}

const UNIQUE_VIOLATION = '23505';

function hashRequest(dto: CreateTransactionDto): string {
  // Orden fijo de campos: el mismo cuerpo siempre da el mismo hash.
  const canonical = JSON.stringify([
    dto.accountExternalIdDebit,
    dto.accountExternalIdCredit,
    dto.tranferTypeId,
    dto.value.toFixed(2),
  ]);
  return createHash('sha256').update(canonical).digest('hex');
}

@Injectable()
export class TransactionsService implements OnModuleInit {
  // Catálogo pequeño y estático: se carga una vez para no ir a la BD en cada POST.
  private transferTypes = new Map<number, TransferType>();

  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Transaction)
    private readonly transactions: Repository<Transaction>,
    @InjectRepository(TransferType)
    private readonly types: Repository<TransferType>,
    @InjectRepository(IdempotencyKey)
    private readonly idempotencyKeys: Repository<IdempotencyKey>,
    private readonly cache: TransactionCacheService,
  ) {}

  async onModuleInit(): Promise<void> {
    const types = await this.types.find();
    this.transferTypes = new Map(types.map((t) => [t.id, t]));
  }

  async create(
    dto: CreateTransactionDto,
    idempotencyKey?: string,
  ): Promise<CreateResult> {
    const requestHash = idempotencyKey ? hashRequest(dto) : undefined;
    if (idempotencyKey && requestHash) {
      const replay = await this.findReplay(idempotencyKey, requestHash);
      if (replay) return { transaction: replay, replayed: true };
    }

    const transferType = this.transferTypes.get(dto.tranferTypeId);
    if (!transferType) {
      throw new BadRequestException([
        `tranferTypeId ${dto.tranferTypeId} does not exist`,
      ]);
    }

    const transaction = this.transactions.create({
      transactionExternalId: randomUUID(),
      accountExternalIdDebit: dto.accountExternalIdDebit,
      accountExternalIdCredit: dto.accountExternalIdCredit,
      transferTypeId: transferType.id,
      transferType,
      value: dto.value.toFixed(2),
      status: TransactionStatus.Pending,
      createdAt: new Date(),
    });

    // Transacción, evento (outbox) y llave de idempotencia se guardan juntos: o todo o nada.
    try {
      await this.dataSource.transaction(async (em) => {
        await em.insert(Transaction, transaction);
        const event: TransactionCreatedEvent = {
          transactionExternalId: transaction.transactionExternalId,
          accountExternalIdDebit: transaction.accountExternalIdDebit,
          accountExternalIdCredit: transaction.accountExternalIdCredit,
          tranferTypeId: transaction.transferTypeId,
          value: transaction.value,
          createdAt: transaction.createdAt.toISOString(),
        };
        await em.insert(OutboxMessage, {
          aggregateId: transaction.transactionExternalId,
          topic: Topics.TransactionCreated,
          payload: event,
        });
        if (idempotencyKey && requestHash) {
          await em.insert(IdempotencyKey, {
            key: idempotencyKey,
            requestHash,
            transactionExternalId: transaction.transactionExternalId,
          });
        }
      });
    } catch (error) {
      // Dos requests concurrentes con la misma llave: la PK decide y el perdedor
      // devuelve la transacción del ganador (su propio insert ya se revirtió).
      if (
        idempotencyKey &&
        requestHash &&
        error instanceof QueryFailedError &&
        (error.driverError as { code?: string }).code === UNIQUE_VIOLATION
      ) {
        const replay = await this.findReplay(idempotencyKey, requestHash);
        if (replay) return { transaction: replay, replayed: true };
      }
      throw error;
    }
    return { transaction, replayed: false };
  }

  private async findReplay(
    key: string,
    requestHash: string,
  ): Promise<Transaction | null> {
    const existing = await this.idempotencyKeys.findOneBy({ key });
    if (!existing) return null;
    if (existing.requestHash !== requestHash) {
      throw new UnprocessableEntityException(
        'Idempotency-Key was already used with a different request body',
      );
    }
    return this.findById(existing.transactionExternalId);
  }

  async findById(transactionExternalId: string): Promise<Transaction> {
    const transaction = await this.transactions.findOneBy({
      transactionExternalId,
    });
    if (!transaction) {
      throw new NotFoundException(
        `Transaction ${transactionExternalId} not found`,
      );
    }
    return transaction;
  }

  async findResponse(
    transactionExternalId: string,
  ): Promise<{ response: TransactionResponseDto; cacheHit: boolean }> {
    const cached = await this.cache.get(transactionExternalId);
    if (cached) return { response: cached, cacheHit: true };

    const response = toTransactionResponse(
      await this.findById(transactionExternalId),
    );
    if (response.transactionStatus.name !== TransactionStatus.Pending) {
      await this.cache.set(response);
    }
    return { response, cacheHit: false };
  }

  // Solo pending → approved|rejected. El WHERE hace la transición atómica e
  // idempotente: un evento duplicado o tardío no cambia nada (0 filas).
  async applyStatus(
    transactionExternalId: string,
    status: FinalTransactionStatus,
  ): Promise<boolean> {
    const result = await this.transactions.update(
      { transactionExternalId, status: TransactionStatus.Pending },
      { status },
    );
    const updated = (result.affected ?? 0) > 0;
    if (updated) {
      // Se precalienta la caché con el estado final: el próximo GET ya no va a la BD.
      await this.cache.set(
        toTransactionResponse(await this.findById(transactionExternalId)),
      );
    }
    return updated;
  }
}
