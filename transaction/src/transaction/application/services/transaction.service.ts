import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import {
  CreateTransactionDto,
  EnumStatus,
  UpdateTransactionDto,
} from 'src/transaction/domain/models';
import {
  ITransactionRepository,
  ITransactionService,
  TransactionKey,
} from 'src/transaction/domain/ports';

@Injectable()
export class TransactionService implements ITransactionService {
  constructor(
    @Inject(TransactionKey.REPOSITORY)
    private readonly repository: ITransactionRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async create(createTransactionDto: CreateTransactionDto): Promise<any> {
    const transaction = await this.repository.create({
      value: createTransactionDto.value,
      tranferTypeId: createTransactionDto.tranferTypeId,
      transactionStatus: { name: EnumStatus.pending },
    } as any);

    const mapper = {
      transactionExternalId: transaction.id,
      transactionType: {
        name: transaction.tranferTypeId > 1 ? 'soles' : 'dolares',
      },
      transactionStatus: transaction.transactionStatus,
      value: transaction.value,
      createdAt: transaction.createdAt,
    };
    await this.cacheManager.set(transaction.id, mapper);
    return mapper;
  }

  findAll(): Promise<any> {
    return this.repository.findAll();
  }

  findOne(id: string): Promise<any> {
    return this.repository.findOne(id);
  }

  update(id: string, updateTransactionDto: UpdateTransactionDto): Promise<any> {
    return this.repository.update(id, updateTransactionDto);
  }

  delete(id: string): Promise<any> {
    return this.repository.delete(id);
  }
}
