import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ShowTransactionDto } from './dto/show-transaction.dto';
import { LoggerService } from '../infraestructure/logger/logger.service';
import { statusTransaction } from './transaction.consts';
import { TransactionConfig } from './transaction.config';
import { TransferType } from './transaction-type.entity';

@Injectable()
export class TransactionService {
  private context = 'TransactionService';

  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(TransferType)
    private transferTypeRepository: Repository<TransferType>,
    @Inject('YAPE_EVENT_BUS')
    private readonly eventClient: ClientKafka,
    private readonly logger: LoggerService,
    private readonly transactionConfig: TransactionConfig,
  ) {}

  async add(transactionDto: CreateTransactionDto): Promise<ShowTransactionDto> {
    const context = `${this.context}-add`;
    this.logger.log(context, 'start', {
      CreateTransactionDto: transactionDto,
    });

    const existingTransferType = await this.transferTypeRepository.findOne({
      where: {
        transferTypeId: transactionDto.tranferTypeId,
      },
      select: ['transferTypeId'],
    });

    if (!existingTransferType) {
      throw new NotFoundException(
        this.transactionConfig.TRANSFER_TYPE_NOT_FOUND,
      );
    }

    const transaction = new Transaction();
    transaction.accountExternalIdDebit = transactionDto.accountExternalIdDebit;
    transaction.accountExternalIdCredit =
      transactionDto.accountExternalIdCredit;
    transaction.tranferTypeId = transactionDto.tranferTypeId;
    transaction.value = transactionDto.value;

    const savedTransaction = await this.transactionRepository.save(transaction);

    this.logger.log(context, 'end', {
      savedTransaction,
    });

    this.eventClient.emit(
      'validate-transaction',
      JSON.stringify(savedTransaction),
    );
    return this.getOne(savedTransaction.transactionExternalId);
  }

  async update(transaction: UpdateTransactionDto): Promise<boolean> {
    const context = `${this.context}-update`;

    this.logger.log(context, 'start', {
      UpdateTransactionDto: transaction,
    });

    const toUpdate = {
      transactionStatusId: statusTransaction[transaction.result],
    };

    this.logger.log(context, 'processing', {
      toUpdate,
    });

    return this.transactionRepository
      .update(transaction.transactionExternalId, toUpdate)
      .then((updatedTransaction) => {
        this.logger.log(context, 'end', {
          updatedTransaction,
        });
        return true;
      })
      .catch((error) => {
        this.logger.error(context, 'end', {
          error,
        });
        return false;
      });
  }

  async getOne(transactionExternalId: string): Promise<ShowTransactionDto> {
    const context = `${this.context}-getOne`;
    this.logger.log(context, 'start', {
      transactionExternalId,
    });
    const transaction = await this.transactionRepository.findOne({
      where: {
        transactionExternalId,
      },
      relations: ['tranferType', 'transactionStatus'],
    });

    if (!transaction) {
      throw new NotFoundException(this.transactionConfig.TRANSACTION_NOT_FOUND);
    }

    const showTransactionDto = {
      transactionExternalId: transaction.transactionExternalId,
      transactionType: {
        name: transaction.tranferType['name'],
      },
      transactionStatus: {
        name: transaction.transactionStatus['name'],
      },
      value: transaction.value,
      createdAt: transaction.createdAt,
    };
    this.logger.log(context, 'end', {
      showTransactionDto,
    });
    return showTransactionDto;
  }
}
