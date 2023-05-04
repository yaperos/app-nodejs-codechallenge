import {
  Inject,
  Injectable,
  forwardRef,
  NotFoundException,
} from '@nestjs/common';
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
import { Logger } from '@nestjs/common';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

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

    this.logger.log(transaction);

    this.transactionCliente.emit(
      'createAntiFraud',
      new CreateAntiFraudDto(
        transaction.transactionExternalId,
        transaction.value,
      ).ToString(),
    );

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
    return this.transactionRepository.findOne({ where: { id } });
  }

  findOneByTransactionId(transactionExternalId: string) {
    return this.transactionRepository.findOne({
      where: { transactionExternalId },
    });
  }

  update(id: number, updateTransactionInput: UpdateTransactionInput) {
    this.logger.log(updateTransactionInput);
    return this.transactionRepository.update(
      { id },
      {
        ...updateTransactionInput,
        updateAt: new Date(),
      },
    );
  }

  async remove(id: number) {
    const transaction = await this.findOne(id);

    if (!transaction) {
      throw new NotFoundException();
    }

    await this.transactionRepository.delete({ id: transaction.id });

    return transaction;
  }

  getTransactionTypeService(id: number) {
    return this.transactionTypeService.findOne(id);
  }

  getTrasactionStatusService(id: number) {
    return this.trasactionStatusService.findOne(id);
  }
}
