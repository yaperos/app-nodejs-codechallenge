import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTransactionDto } from 'src/dtos/requests/create-transaction.dto';
import { TransactionEvent } from 'src/events/transaction.event';
import { TransactionEntity } from 'src/entities/transaction.entity';
import { Repository } from 'typeorm';
import { TransactionStatus } from 'src/shared/transaction-status.enum';
import { TransactionStatusUpdateDto } from 'src/messages/transaction-status-update.dto';


@Injectable()
export class TransactionService implements OnModuleInit {

  constructor(
    @Inject('ANTIFRAUD-CLIENT') private readonly kafkaClient: ClientKafka,
    @InjectRepository(TransactionEntity) private readonly transactionRepository: Repository<TransactionEntity>,
  ) { }

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('antifraud');
    await this.kafkaClient.connect();
  }


  async createTransaction(request: CreateTransactionDto) {

    const newRequest = {
      value: request.value,
      statusId: TransactionStatus.PENDING,
      typeId: request.tranferTypeId,
      accountExternalIdCredit: request.accountExternalIdCredit,
      accountExternalIdDebit: request.accountExternalIdDebit
    };

    const transaction = await this.transactionRepository.save(newRequest);

    return this.kafkaClient.send('antifraud', new TransactionEvent(
      transaction.transactionExternalId,
      transaction.value
      ).toJson()
    );

  }


  async handleTransactionStatusUpdate(request: TransactionStatusUpdateDto) {
    const transaction = await this.transactionRepository.findOne({ where: {transactionExternalId : request.transactionExternalId} });
    if (transaction) {
        transaction.statusId = request.statusId;
        await this.transactionRepository.save(transaction);
    }
}

}
