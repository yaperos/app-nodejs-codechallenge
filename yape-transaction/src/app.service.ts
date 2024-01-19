import { TransactionInputDto } from './dto/transaction.input';
import { TransactionOutputDto } from './dto/transaction.output';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { Transaction } from './entities/transaction.entity';
import { StatusDto } from './dto/status.dto';

@Injectable()
export class AppService {
  public constructor(
    @InjectRepository(Transaction, 'ConnectionOne')
    private repository: Repository<Transaction>,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {
    console.log('***Inicio kafka***')
    console.log(this.kafkaClient);
    console.log('*****************')
  }

  private getRepository(): Repository<Transaction> {
    return this.repository
  }

  public async create(transactionDto: TransactionInputDto,): Promise<TransactionOutputDto> {

    console.log('createDto', transactionDto);

    const transactionRepository = this.getRepository();

    const transaction = transactionRepository.create(transactionDto);
    await transactionRepository.save(transaction);
    this.kafkaClient.emit('topic_created',JSON.stringify(transaction));
    const ctOutdto = new TransactionOutputDto();
    ctOutdto.transactionExternalId = transaction.transactionExternalId;
    ctOutdto.accountExternalIdDebit = transaction.accountExternalIdDebit;
    ctOutdto.accountExternalIdCredit = transaction.accountExternalIdCredit;
    ctOutdto.value = transaction.value;
    ctOutdto.createdAt = new Date();
    return ctOutdto;
  }

  public async getAllTransactions(): Promise<Transaction[]> {
    const transactions = await this.repository.find();
    return [...transactions];
  }

  public async transactionApproved(dto: StatusDto, ): Promise<void> {
    const transactionRepository = this.getRepository();
    const transaction = await transactionRepository.findOne({
      where: {
        transactionExternalId: dto.transactionExternalId,
      },
    });
    if (!transaction) {
      console.log('Error: transaction no existe');
      return;
    }
    transaction.status = dto.transactionStatus.name;
    await transactionRepository.save(transaction);
  }
  public async transactionRejected(
    transactionStatusDto: StatusDto,
  ): Promise<void> {
    const repository = this.getRepository();
    const transaction = await repository.findOne({
      where: {
        transactionExternalId: transactionStatusDto.transactionExternalId,
      },
    });
    if (!transaction) {
      console.log('Error: transaction no existe');
      return;
    }
    transaction.status = transactionStatusDto.transactionStatus.name;
    await repository.save(transaction);
  }
}