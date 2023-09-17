import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { EVENT_BUS, EventBus } from '@app/common';
import { CreateExternalTransactionDto } from '../infrastructure/dto';
import { ExternalTransactionStatus } from '../domain/enums';
import { Cache } from 'cache-manager';
import {
  EXTERNAL_TRANSACTION_REPOSITORY,
  ExternalTransactionRepository,
} from '../domain/external-transaction.repository';
import { ExternalTransaction } from '../domain/external-transaction.entity';
import { ExternalTransactionCreatedEvent } from '../domain/events';

@Injectable()
export class ExternalTransactionsService {
  private readonly logger = new Logger(ExternalTransactionsService.name);

  constructor(
    @Inject(EVENT_BUS) private eventBus: EventBus,
    @Inject(EXTERNAL_TRANSACTION_REPOSITORY)
    private externalTransactionRepository: ExternalTransactionRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(
    dto: CreateExternalTransactionDto,
  ): Promise<ExternalTransaction> {
    const externalTransaction = await this.externalTransactionRepository.create(
      dto,
    );

    this.logger.debug(
      'Transaction Created',
      externalTransaction.toPrimitives(),
    );

    this.logger.debug('Emitting event "transaction.created"');

    await this.eventBus.publish(
      new ExternalTransactionCreatedEvent(
        externalTransaction.id,
        externalTransaction.value,
      ),
    );

    return externalTransaction;
  }

  async updateStatusById(
    id: string,
    status: ExternalTransactionStatus,
  ): Promise<void> {
    this.logger.debug(`Updating status from ${id} to ${status}`);

    await this.externalTransactionRepository.updateStatusById(id, { status });

    await this.cacheManager.del(`/external-transactions/${id}`);
  }

  findById(id: string): Promise<ExternalTransaction> {
    return this.externalTransactionRepository.findById(id);
  }
}
