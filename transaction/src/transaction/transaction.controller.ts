import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transaction')
export class TransController {
  constructor(private readonly transService: TransactionService) {}

  @Post('/add')
  emitMessage(@Body() createTranDto: CreateTransactionDto) {
    return this.transService.saveTransaction(createTranDto);
  }

  @Get('/:idTransaction')
  getTransacion(@Param('idTransaction') idTransaction: string) {
    return this.transService.getTransacion(idTransaction);
  }

  @MessagePattern('antifraude.validate')
  receiveMessage(@Body() createTranDto: any) {
    this.transService.validatedStatus(createTranDto);
  }
}
