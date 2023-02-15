import { Injectable } from '@nestjs/common';
import { CreateTransactionStatusInput } from './dto/create-transaction-status.input';
import { UpdateTransactionStatusInput } from './dto/update-transaction-status.input';
import { TransactionStatus } from './transaction-status.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TransactionStatusService {
  constructor(
    @InjectRepository(TransactionStatus)
    private transactionsStatusRepository: Repository<TransactionStatus>,
  ) {}

  createTransaction(transactionStatus: CreateTransactionStatusInput): Promise<TransactionStatus> {
    console.log(CreateTransactionStatusInput);

    const newTransactionStatus = this.transactionsStatusRepository.create(transactionStatus);
    return this.transactionsStatusRepository.save(newTransactionStatus);
  }

  async findAll(): Promise<TransactionStatus[]> {
    const transationsStatus = await this.transactionsStatusRepository.find();
    console.log('find');
    console.log(transationsStatus);
    return transationsStatus;
  }

  async findOne(id: string): Promise<TransactionStatus> {
    console.log('findOne');
 
    return this.transactionsStatusRepository.findOne({ where: [{ id: id }] });
  }

  update(
    id: number,
    updateTransactionStatusInput: UpdateTransactionStatusInput,
  ) {
    return `This action updates a #${id} transactionStatus`;
  }

  remove(id: number) {
    return `This action removes a #${id} transactionStatus`;
  }
}
