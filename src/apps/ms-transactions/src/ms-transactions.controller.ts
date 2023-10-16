import { Body, Param, Controller, Delete, Get, Post } from '@nestjs/common'
import { EventPattern } from '@nestjs/microservices'
import { TransactionService } from './ms-transactions.service'
import { CreateTransactionDto } from './dto/create-transaction.dto'

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto)
  }

  @EventPattern('transaction_processed')
  updateTransaction(payload: any) {
    return this.transactionService.update(payload)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(id)
  }

  @Get()
  findAll() {
    return this.transactionService.findAll()
  }

  @Delete()
  deleteAll() {
    return this.transactionService.deleteAll()
  }
}
