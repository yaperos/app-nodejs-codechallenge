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
  Put,
  ParseIntPipe
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ApiTransactionService } from './api-transaction.service';
import { CreateTransaction, CreateTransferType, TransactionM, TransferType, UpdateTransaction, UpdateTransferType } from '@app/common/domain/model/transaction.model';

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
    return this.apiTransactionService.remove(id);
  }

  @Get('/transferTypes/all')
  findAllTransferTypes() {
    return this.apiTransactionService.findAllTransferTypes();
  }

  @Get('/transferTypes/:id')
  findOneTransferType(@Param('id',ParseIntPipe) id: number) {
    return this.apiTransactionService.findOneTransferType(id);
  }

  @Post('/transferTypes')
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
  async createTransferType(
    @Body() createDTO: CreateTransferType,
  ): Promise<TransferType> {
    const transferType = await this.apiTransactionService.createTransferType(
      createDTO,
    );
    return transferType;
  }

  @Put('/transferTypes/:id')
  updateTransferType(@Param('id',ParseIntPipe) id: number, @Body() updateTransferTypeDto: UpdateTransferType) {
    return this.apiTransactionService.updateTransferType(+id, updateTransferTypeDto);
  }

  @Delete('/transferTypes/:id')
  removeTransferType(@Param('id',ParseIntPipe) id: number) {
    return this.apiTransactionService.removeTransferType(+id);
  }


}
