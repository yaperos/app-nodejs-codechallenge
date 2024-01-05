import {
  BadRequestException,
  Inject,
  Injectable,
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
import {
  CreateAntiFraudDto,
  LoggerService,
  TRANSACTION_STATUS,
} from '@app/shared';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

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

  async createTransaction(createTransactionInput: CreateTransactionInput) {
    const { tranferTypeId } = createTransactionInput;

    this.logger.info(
      `${TransactionsService.name}.createTransaction.entry`,
      createTransactionInput,
    );

    const transaction = this.transactionRepository.create(
      createTransactionInput,
    );

    transaction.transactionExternalId = v4();

    const status = await this.transactionStatusRepository.findOne({
      where: { id: TRANSACTION_STATUS.REJECTED },
    });

    this.logger.info(
      `${TransactionsService.name}.createTransaction.getStatus`,
      status,
    );

    if (!status) throw new NotFoundException('Status Not Found');

    transaction.transactionStatusId = status.id;

    const type = await this.transactionTypeRepository.findOne({
      where: {
        id: tranferTypeId,
      },
    });

    this.logger.info(
      `${TransactionsService.name}.createTransaction.getType`,
      type,
    );

    if (!type) throw new NotFoundException('Type Not Found');

    transaction.transactionTypeId = createTransactionInput.tranferTypeId;

    await this.transactionRepository.save(transaction);

    this.logger.info(
      `${TransactionsService.name}.createTransaction.saved`,
      transaction,
    );

    const createAntiFraudDto: CreateAntiFraudDto = {
      transactionExternalId: transaction.transactionExternalId,
      value: transaction.value,
    };

    this.logger.info(
      `${TransactionsService.name}.createTransaction.sendQueue`,
      createAntiFraudDto,
    );

    this.antiFraudClient
      .emit('transactionValidation', JSON.stringify(createAntiFraudDto))
      .subscribe({
        error(err) {
          console.log(err);
        },
      });

    return transaction;
  }

  findAll(orderBy: string, limit: number) {
    const queryBuilder =
      this.transactionRepository.createQueryBuilder('transaction');

    if (orderBy) {
      const [field, direction] = orderBy.split('_');

      if (field && direction) {
        queryBuilder.orderBy(
          `transaction.${field}`,
          direction as 'ASC' | 'DESC',
        );
      }
    }

    if (limit) {
      queryBuilder.limit(limit);
    }

    return queryBuilder.getMany();
  }

  findAllByTransactionType(id: number) {
    return this.transactionRepository.find({
      where: { transactionTypeId: id },
    });
  }

  findOne(transactionExternalId: string) {
    return this.transactionRepository.findOne({
      where: { transactionExternalId },
    });
  }

  findOneByTransactionId(transactionExternalId: string) {
    return this.transactionRepository.findOne({
      where: { transactionExternalId },
    });
  }

  async updateTransaction(
    transactionExternalId: string,
    updateTransactionInput: UpdateTransactionDto,
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
        transactionStatusId: updateTransactionInput.transactionStatusId,
      },
    );

    return bodyUpdate;
  }

  async remove(transactionExternalId: string) {
    const transaction = await this.findOne(transactionExternalId);

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
