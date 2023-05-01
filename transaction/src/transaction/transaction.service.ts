import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { UpdateTransactionInput } from './dto/update-transaction.input';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionTypeService } from 'src/transaction-type/transaction-type.service';
import { TransactionStatusService } from 'src/transaction-status/transaction-status.service';
import { ClientKafka } from '@nestjs/microservices';
import { CreateAntiFraudDto } from './dto/create-anti-fraud.dto';
import { v4 } from 'uuid';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @Inject(forwardRef(() => TransactionTypeService))
    private readonly transactionTypeService: TransactionTypeService,
    @Inject(forwardRef(() => TransactionStatusService))
    private readonly trasactionStatusService: TransactionStatusService,
    @Inject('TRANSACTION_SERVICE')
    private readonly transactionCliente: ClientKafka,
  ) {}

  async create(createTransactionInput: CreateTransactionInput) {
    const transaction = this.transactionRepository.create(
      createTransactionInput,
    );
    transaction.transactionExternalId = v4();
    transaction.transactionStatusId = 1;
    transaction.transactionTypeId = createTransactionInput.tranferTypeId;

    await this.transactionRepository.save(transaction);

    this.transactionCliente.emit(
      'createAntiFraud',
      new CreateAntiFraudDto(
        transaction.transactionExternalId,
        transaction.value,
      ).ToString(),
    );
    console.log(transaction);
    return transaction;
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
