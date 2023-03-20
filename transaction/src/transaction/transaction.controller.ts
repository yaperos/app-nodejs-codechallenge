import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateTransactionDto } from './dto/transaction.dto';
import { TransactionApproved } from './interfaces/aproved.interfaces';
import { Transaction } from './transaction.entity';
import { TransactionService } from './transaction.service';

@Controller('transactions')
export class TransactionController {
  constructor( private transactionService:TransactionService ){}

  @Get()
  find(): Promise<Transaction[]>{
    return this.transactionService.allTransaction()
  }

  @Post()
  new( @Body() data: CreateTransactionDto ): Promise<any>{
    return this.transactionService.newTransaction( data )
  }

  @MessagePattern('transaction.approved')
  transactionApproved( @Payload() payload: TransactionApproved ): Promise<void> {
    Logger.debug( payload )
    return this.transactionService.approvedTransaction( payload.transactionExternalId )
  }

  @MessagePattern('transaction.rejected')
  transactionRejected( @Payload() payload: any ): Promise<void> {
    Logger.debug( payload )
    return this.transactionService.rejectTransaction( payload.transactionExternalId )
  }
}
