import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateTransactionRequest } from './dto/create-transaction-request.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async createTransaction(
    @Body() transactionRequest: CreateTransactionRequest,
  ) {
    const dto = {
      ...transactionRequest,
      transactionExternalId: transactionRequest?.accountExternalId,
      transactionStatus: 'pending',
    };

    const obs = await this.appService.createTransaction(dto);

    obs.subscribe({
      async next(transaction) {
        // UPDATE ON DB
        console.log(transaction);
      },
      error(msg) {
        console.log('Error', msg);
      },
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appService.findOne(+id);
  }

  @Get()
  findAll() {
    return this.appService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    const dto = { ...updateTransactionDto };
    return this.appService.update(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appService.remove(+id);
  }
}
