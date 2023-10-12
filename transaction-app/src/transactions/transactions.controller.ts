import { Controller, OnModuleInit, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ClientKafka, EventPattern } from '@nestjs/microservices';
import { CreateTransactionRequest } from '../requests/create-transaction-request.dto';
@Controller()
export class TransactionsController implements OnModuleInit {
  constructor(private readonly transactionsService: TransactionsService, @Inject('ANTIFRAUD_SERVICE') private readonly antifraudClient: ClientKafka) { }

  @EventPattern('transaction-created')
  handleTransactionCreateds(createTransactionRequest: CreateTransactionRequest) {

    this.transactionsService.handleTransactionCreated(createTransactionRequest)
  }

  onModuleInit() {
    this.antifraudClient.subscribeToResponseOf('validate-transaction')
  }

  @MessagePattern('findAllTransactions')
  findAll() {
    return this.transactionsService.findAll();
  }

  @MessagePattern('findOneTransaction')
  findOne(@Payload() id: number) {
    return this.transactionsService.findOne(id);
  }

  @MessagePattern('updateTransaction')
  update(@Payload() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionsService.update(updateTransactionDto.id, updateTransactionDto);
  }

  @MessagePattern('removeTransaction')
  remove(@Payload() id: number) {
    return this.transactionsService.remove(id);
  }
}
