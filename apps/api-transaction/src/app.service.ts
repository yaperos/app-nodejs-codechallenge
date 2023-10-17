import {
  CLIENT_TRANSACTION_NAME,
  CreateTransactionDto,
  CreatedTransactionDto,
  GetTransactionDto,
  MessageTransactionDto,
  TRANSACTION_EVENT_ID,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
  Transaction,
} from '@app/core-library';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @Inject(CLIENT_TRANSACTION_NAME)
    private readonly kafkaClient: ClientKafka,
  ) {}
  async findOne(transactionExternalId: string): Promise<GetTransactionDto> {
    this.logger.log('-- init findOne --');
    this.logger.log(`Transaction find by #${transactionExternalId} `);
    const transaction = await this.transactionRepository.findOne({
      where: {
        transactionExternalId,
      },
      relations: {
        transactionStatus: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException(
        `Transaction #${transactionExternalId} not found`,
      );
    }

    this.logger.log('-- end findOne --');
    this.logger.log(JSON.stringify(transaction));

    const response = new GetTransactionDto(
      transaction.transactionExternalId,
      transaction.value,
      transaction.createdAt,
      transaction.transactionStatus,
      transaction.transactionType,
    );

    return response;
  }

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<CreatedTransactionDto> {
    this.logger.log('-- init create --');
    this.logger.log(JSON.stringify(createTransactionDto));
    const transaction = this.transactionRepository.create({
      ...createTransactionDto,
      transactionExternalId: uuidv4(),
      transactionStatusId: TRANSACTION_STATUS.PENDING,
      transactionTypeId: TRANSACTION_TYPE.TRANSFER,
    });

    const result = await this.transactionRepository.save(transaction);

    const message = new MessageTransactionDto(
      result.transactionExternalId,
      result.transactionStatusId,
      result.value,
    ).toString();

    this.logger.log('-- kafka message --');
    this.logger.log(message);

    this.kafkaClient.emit(TRANSACTION_EVENT_ID.CREATED, message);
    this.logger.log('-- end create --');
    this.logger.log(JSON.stringify(result));

    const response = new CreatedTransactionDto(
      result.transactionExternalId,
      result.value,
      result.createdAt,
    );
    return response;
  }
}
