import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    try {
      const transaction =
        this.transactionRepository.create(createTransactionDto);
      return this.transactionRepository.save(transaction);
    } catch (error) {
      throw new InternalServerErrorException(
        'No fue posible crear la trsanccion',
      );
    }
  }

  async update(id: string, status: string) {
    const transaction = await this.transactionRepository.preload({
      id: id,
      transactionStatus: status,
    });
    if (!transaction)
      throw new NotFoundException(`Transaction with #${id} not found`);

    return this.transactionRepository.save(transaction);
  }
}
