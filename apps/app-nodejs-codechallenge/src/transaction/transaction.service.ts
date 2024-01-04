import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { Transaction } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionType } from './entities/transaction-type.entity';
import { TransactionStatus } from './entities/transaction-status.entity';
import { ClientKafka } from '@nestjs/microservices';
import { v4 } from 'uuid';
import { CreateAntiFraudDto, LoggerService } from '@app/shared';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionType)
    private transactionTypeRepository: Repository<TransactionType>,
    @InjectRepository(TransactionStatus)
    private transactionStatusRepository: Repository<TransactionStatus>,
    @Inject('ANTI_FRAUD_SERVICE')
    private readonly antiFraudClient: ClientKafka,
    private readonly logger: LoggerService,
  ) {}

  async create(createTransactionInput: CreateTransactionInput) {
    this.logger.info(TransactionsService.name, createTransactionInput);

    const transaction = this.transactionRepository.create(
      createTransactionInput,
    );

    transaction.transactionExternalId = v4();

    const status = await this.transactionStatusRepository.findOne({
      where: { id: 1 },
    });

    this.logger.info(
      `${TransactionsService.name}.transactionStatus.findOne`,
      status,
    );

    if (!status) throw new NotFoundException('Status Not Found');

    transaction.transactionStatusId = status.id;

    const type = await this.transactionTypeRepository.findOne({
      where: {
        id: createTransactionInput.tranferTypeId,
      },
    });

    this.logger.info(
      `${TransactionsService.name}.transactionType.findOne`,
      type,
    );

    if (!type) throw new NotFoundException('Type Not Found');

    transaction.transactionTypeId = createTransactionInput.tranferTypeId;

    await this.transactionRepository.save(transaction);

    this.logger.info(`${TransactionsService.name}.saved`, transaction);

    const createAntiFraudDto: CreateAntiFraudDto = {
      transactionExternalId: transaction.transactionExternalId,
      value: transaction.value,
    };

    Logger.log({ createAntiFraudDto }, `${TransactionsService.name}.sendQueue`);

    this.antiFraudClient
      .emit('transactionValidation', JSON.stringify(createAntiFraudDto))
      .subscribe({
        error(err) {
          console.log(err);
        },
      });

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

  async updateTransaction(
    transactionExternalId: string,
    updateTransactionInput: any,
  ) {
    this.logger.info(
      `${TransactionsService.name}.updateTransaction.entry`,
      updateTransactionInput,
      transactionExternalId,
    );

    const transaction = await this.transactionRepository.findOne({
      where: { transactionExternalId: transactionExternalId },
    });

    this.logger.info(
      `${TransactionsService.name}.updateTransaction.getTransaction`,
      transaction,
      transactionExternalId,
    );

    if (!transaction) throw new BadRequestException('Transaction Not Found');

    const bodyUpdate = await this.transactionRepository.update(
      { transactionExternalId },
      {
        transactionStatusId: updateTransactionInput.status,
      },
    );

    return bodyUpdate;
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
    return this.transactionTypeRepository.findOne({ where: { id } });
  }

  getTrasactionStatusService(id: number) {
    return this.transactionStatusRepository.findOne({ where: { id } });
  }
}
