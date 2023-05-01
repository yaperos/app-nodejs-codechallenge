import { Injectable } from '@nestjs/common';
import { CreateTransactionStatusInput } from './dto/create-transaction-status.input';
import { UpdateTransactionStatusInput } from './dto/update-transaction-status.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionStatus } from './entities/transaction-status.entity';

@Injectable()
export class TransactionStatusService {
  constructor(
    @InjectRepository(TransactionStatus)
    private transactionStatusRepository: Repository<TransactionStatus>,
  ) {}

  create(createTransactionStatusInput: CreateTransactionStatusInput) {
    const status = this.transactionStatusRepository.create(
      createTransactionStatusInput,
    );

    return this.transactionStatusRepository.save(status);
  }

  findAll() {
    return this.transactionStatusRepository.find();
  }

  findOne(id: number) {
    return this.transactionStatusRepository.findOne({
      where: { id },
    });
  }

  findOneByName(name: string) {
    return this.transactionStatusRepository.findOne({
      where: { name },
    });
  }

  update(
    id: number,
    updateTransactionStatusInput: UpdateTransactionStatusInput,
  ) {
    return this.transactionStatusRepository.update(
      { id },
      updateTransactionStatusInput,
    );
  }

  remove(id: number) {
    return this.transactionStatusRepository.delete({ id });
  }
}
