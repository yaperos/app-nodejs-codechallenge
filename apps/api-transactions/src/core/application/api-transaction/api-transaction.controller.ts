import {
  Patch,
  Param,
  Delete,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ApiTransactionService } from './api-transaction.service';
import { CreateTransaction, Transaction } from '../../domain/model/transaction.model';

@Controller('api-transaction')
export class ApiTransactionController {
  constructor(private readonly apiTransactionService: ApiTransactionService) { }


  @Get()
  getHello() {
    return this.apiTransactionService.getHello();
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Transaction,
  })
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @UseInterceptors(ClassSerializerInterceptor)
  async createRequester(
    @Body() createDTO: CreateTransaction,
  ): Promise<Transaction> {
    const transaction = await this.apiTransactionService.CreateTransaction(
      createDTO,
    );
    return new Transaction(transaction);
  }

  @Get()
  findAll() {
    return this.apiTransactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.apiTransactionService.findOne(+id);
  }
  /*
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateApiTransactionDto: UpdateApiTransactionDto) {
      return this.apiTransactionService.update(+id, updateApiTransactionDto);
    }
  */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apiTransactionService.remove(+id);
  }
}
