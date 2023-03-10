import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import axios from 'axios';
import * as dotenv from 'dotenv';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService) {
      dotenv.config()
    }

  @Post()
  async create(@Body() postData: CreateTransactionDto): Promise<any> {
    var response = this.transactionsService.create(postData);
    var transactionId = (await response).transactionExternalId;
    var _this = this;
    return await axios.post(process.env.WEBSERVICE_FRAUDS+'/frauds/evaluate', {transactionId: (await response).transactionExternalId, value: (await response).value}).then( async function(axiosResponse){
      var transaction = _this.transactionsService.transaction(transactionId);
      
      return {
          transactionExternalId: (await transaction).transactionExternalId,
          transactionType: {
              name: (await transaction).transactionTypeName
          },
          transactionStatus: {
              name: (await transaction).transactionStatus
          },
          value: (await transaction).value,
          createdAt: (await transaction).createdAt
      };
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionsService.update(id, updateTransactionDto);
  }

}
