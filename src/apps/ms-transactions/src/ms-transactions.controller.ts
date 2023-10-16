import { Body, Param, Controller, Delete, Get, Post } from '@nestjs/common'
import { EventPattern } from '@nestjs/microservices'
import { TransactionService } from './ms-transactions.service'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto)
  }

  @EventPattern('transaction_processed')
  updateTransaction(updateTransactionDto: UpdateTransactionDto) {
    return this.transactionService.update(updateTransactionDto)
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
