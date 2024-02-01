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
  ValidationPipe,
  HttpCode,
  HttpStatus,
  Put
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ApiTransactionService } from './api-transaction.service';
import { CreateTransaction, TransactionM, UpdateTransaction } from '@app/common/domain/model/transaction.model';

@Controller('api-transaction')
export class ApiTransactionController {
  constructor(private readonly apiTransactionService: ApiTransactionService) { }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TransactionM,
  })
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @UseInterceptors(ClassSerializerInterceptor)
  async createTransaction(
    @Body() createDTO: CreateTransaction,
  ): Promise<TransactionM> {
    const transaction = await this.apiTransactionService.CreateTransaction(
      createDTO,
    );
    return new TransactionM(transaction);
  }

  @Get('/all')
  findAll() {
    return this.apiTransactionService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  findOne(@Param('id') id: string) {
    return this.apiTransactionService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateApiTransactionDto: UpdateTransaction) {
    return this.apiTransactionService.update(id, updateApiTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apiTransactionService.remove(+id);
  }
}
