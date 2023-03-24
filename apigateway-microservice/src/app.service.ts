import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateTransactionRequest, CreateTransactionResponse } from './dto/create-transaction.dto';
import { TransactionCreatedEvent } from './dto/transaction-created.dto';
import { GeneralResponse } from './dto/general-response.dto';
import { AppRepository } from './app.repository';
import { MessagesResponses } from './util/message.util';
import { CodeResponses, Status } from './util/const.util';

@Injectable()
export class AppService {
  constructor(
    @Inject('BILLING_SERVICE') private readonly billingClient: ClientKafka,
    private readonly appRepository: AppRepository
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createTransaction(createTransactionDto: CreateTransactionRequest) {
    if(!createTransactionDto.accountExternalIdCredit && !createTransactionDto.accountExternalIdDebit){
      return new BadRequestException();
    }
    const newTransaction:any = await this.appRepository.createTransaction(createTransactionDto);

    this.billingClient.emit(
      'order_created',
      new TransactionCreatedEvent(newTransaction._id, newTransaction.value),
    );

    const data =  new CreateTransactionResponse(newTransaction._id,{name:newTransaction.typeId},{name:newTransaction.status},newTransaction.value, newTransaction.createdAt);
    return new GeneralResponse(MessagesResponses.TRANSACTION_CREATED_SUCCESS,CodeResponses.OK,data);
  }
}
