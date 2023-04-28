import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { UpdateTransactionInput } from './dto/update-transaction.input';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionTypeService } from 'src/transaction-type/transaction-type.service';
import { TransactionStatusService } from 'src/transaction-status/transaction-status.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @Inject(forwardRef(() => TransactionTypeService))
    private readonly transactionTypeService: TransactionTypeService,
    @Inject(forwardRef(() => TransactionStatusService))
    private readonly trasactionStatusService: TransactionStatusService,
  ) {}

  create(createTransactionInput: CreateTransactionInput) {
    const transaction = this.transactionRepository.create(
      createTransactionInput,
    );

    return this.transactionRepository.save(transaction);
  }

  findAll() {
    return this.transactionRepository.find();
  }

  findAllByTransactionType(id: number) {
    return this.transactionRepository.find({
      where: { transactionTypeId: id },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionInput: UpdateTransactionInput) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }

  getTransactionTypeService(id: number) {
    return this.transactionTypeService.findOne(id);
  }

  getTrasactionStatusService(id: number) {
    return this.trasactionStatusService.findOne(id);
  }
}
