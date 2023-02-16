import { Injectable } from '@nestjs/common';
import { CreateTransactionTypeInput } from './dto/create-transaction-type.input';
import { UpdateTransactionTypeInput } from './dto/update-transaction-type.input';
import { TransactionType } from './transaction-type.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TransactionTypeService {
  constructor(
    @InjectRepository(TransactionType)
    private transactionsTypeRepository: Repository<TransactionType>,
  ) {}

  createTransaction(transactionType: CreateTransactionTypeInput) {
    console.log(CreateTransactionTypeInput);

    const newTransactionType = this.transactionsTypeRepository.create(transactionType);
    return this.transactionsTypeRepository.save(newTransactionType);
  }

  async findAll(): Promise<TransactionType[]> {
    const transationsType = await this.transactionsTypeRepository.find();
    //console.log('find');
    //console.log(transationsType);
    return transationsType;

  }

  async findOne(id: string): Promise<TransactionType> {
    return this.transactionsTypeRepository.findOne({ where: [{ id: id }] });
  }

  update(id: string, updateTransactionTypeInput: UpdateTransactionTypeInput) {
    return `This action updates a #${id} transactionType`;
  }

  remove(id: string) {
    return `This action removes a #${id} transactionType`;
  }
}
