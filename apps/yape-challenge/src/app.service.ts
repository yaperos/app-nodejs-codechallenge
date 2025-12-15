import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { lastValueFrom } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class AppService {

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async createTransaction(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const transaction = this.transactionRepository.create({
      ...createTransactionDto,
      status: 'pending',
    });
    const savedTransaction = await this.transactionRepository.save(transaction);

    await lastValueFrom(
      this.kafkaClient.emit('transaction_created', JSON.stringify({
        transactionExternalId: savedTransaction.transactionExternalId,
        transactionValue: savedTransaction.value
      }))
    );

    return savedTransaction;
  }

  async findTransaction(id: string) {
    const cachedTransaction = await this.cacheManager.get<Transaction>(id);
    if (cachedTransaction) {
      return cachedTransaction;
    }
    const transaction = await this.transactionRepository.findOneBy({ transactionExternalId: id });

    if (transaction) {
      await this.cacheManager.set(id, transaction, 30000);
      return transaction;
    }else{
      console.error(`Transaction with ID ${id} couldn't be saved.`);
      return;
    }    
  }

  async updateStatus(id: string, status: string): Promise<void> {
    const transaction = await this.transactionRepository.findOne({ 
      where: { transactionExternalId: id } 
    });

    if (!transaction) {
      console.error(`Transaction with ID ${id} not found.`);
      return;
    }

    transaction.status = status as 'approved' | 'rejected';
    
    await this.transactionRepository.save(transaction);

    await this.cacheManager.del(id);

    console.log(`Transaction ${id} updated to ${status}`);
  }
}
