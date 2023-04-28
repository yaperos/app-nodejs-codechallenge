import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateTransactionTypeInput } from './dto/create-transaction-type.input';
import { UpdateTransactionTypeInput } from './dto/update-transaction-type.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionType } from './entities/transaction-type.entity';
import { TransactionService } from 'src/transaction/transaction.service';

@Injectable()
export class TransactionTypeService {
  constructor(
    @InjectRepository(TransactionType)
    private transactionTypeRepository: Repository<TransactionType>,
    @Inject(forwardRef(() => TransactionService))
    private transactionService: TransactionService,
  ) {}

  create(createTransactionTypeInput: CreateTransactionTypeInput) {
    const type = this.transactionTypeRepository.create(
      createTransactionTypeInput,
    );
    return this.transactionTypeRepository.save(type);
  }

  findAll() {
    return this.transactionTypeRepository.find();
  }

  findOne(id: number) {
    return this.transactionTypeRepository.findOne({ where: { id } });
  }

  update(id: number, updateTransactionTypeInput: UpdateTransactionTypeInput) {
    return this.transactionTypeRepository.update(
      { id },
      updateTransactionTypeInput,
    );
  }

  remove(id: number) {
    return this.transactionTypeRepository.delete({ id });
  }

  getTransaction(id: number) {
    return this.transactionService.findAllByTransactionType(id);
  }
}
