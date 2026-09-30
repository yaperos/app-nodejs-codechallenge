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
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'node:crypto';
import { DataSource, Repository } from 'typeorm';
import { OutboxMessage } from '../outbox/outbox-message.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { TransferType } from './entities/transfer-type.entity';

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
  ) {}

  async onModuleInit(): Promise<void> {
    const types = await this.types.find();
    this.transferTypes = new Map(types.map((t) => [t.id, t]));
  }

  async create(dto: CreateTransactionDto): Promise<Transaction> {
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

    // Transacción y evento se guardan juntos (outbox): o ambos o ninguno.
    await this.dataSource.transaction(async (em) => {
      await em.insert(Transaction, transaction);
      const event: TransactionCreatedEvent = {
        transactionExternalId: transaction.transactionExternalId,
        value: transaction.value,
        createdAt: transaction.createdAt.toISOString(),
      };
      await em.insert(OutboxMessage, {
        aggregateId: transaction.transactionExternalId,
        topic: Topics.TransactionCreated,
        payload: event,
      });
    });
    return transaction;
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
    return (result.affected ?? 0) > 0;
  }
}
