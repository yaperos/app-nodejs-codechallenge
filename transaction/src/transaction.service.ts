import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { Repository } from 'typeorm';

import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { TransactionStatus } from './entities/transaction-status.entity';
import { TransactionType } from './entities/transaction-type.entity';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('KAFKA_ANTI_FRAUD') private client: ClientKafka,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionStatus)
    private readonly transactionStatusRepository: Repository<TransactionStatus>,
    @InjectRepository(TransactionType)
    private readonly transactionTypeRepository: Repository<TransactionType>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const { tranferTypeId } = createTransactionDto;
    const status = await this.transactionStatusRepository.findOneBy({
      name: 'pending',
    });
    const type = await this.transactionTypeRepository.findOneBy({
      id: tranferTypeId,
    });

    if (!status || !type) {
      throw new NotFoundException(
        'The status or type of transaction was not found.',
      );
    }

    const newTransactionData = {
      ...createTransactionDto,
      transactionStatus: status,
      transactionType: type,
    };
    const newTransactionPending =
      await this.transactionRepository.save(newTransactionData);

    await this.emitToAntiFraud({
      transactionExternalId: newTransactionPending.transactionExternalId,
      value: newTransactionPending.value,
    });

    return { id: newTransactionPending.transactionExternalId };
  }

  private async emitToAntiFraud(newTransaction: any) {
    this.client.emit('transaction_created', JSON.stringify(newTransaction));
  }

  async findOne(transactionExternalId: string) {
    const transaction = await this.transactionRepository.findOne({
      where: { transactionExternalId },
      select: ['transactionExternalId', 'value', 'createdAt'],
      relations: {
        transactionStatus: true,
        transactionType: true,
      },
    });

    return {
      ...transaction,
      transactionStatus: { name: transaction.transactionStatus.name },
      transactionType: { name: transaction.transactionType.name },
    };
  }

  async statusHandle(transactionExternalId: string, transactionStatus: string) {
    try {
      const transaction = await this.transactionRepository.findOneBy({
        transactionExternalId,
      });
      const status = await this.transactionStatusRepository.findOneBy({
        name: transactionStatus,
      });

      transaction.transactionStatus = status;
      await this.transactionRepository.save(transaction);
    } catch (error) {
      throw new BadRequestException('Falied to update transaction status');
    }
  }
}
