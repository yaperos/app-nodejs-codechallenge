import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateTransactionDto, GetTransactionDto } from '@app/core-library';
import { CreatedTransactionDto } from '@app/core-library/dto/created-transaction.dto';

@Controller('transaction')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':id')
  async findOne(
    @Param('id') transactionExternalId: string,
  ): Promise<GetTransactionDto> {
    return this.appService.findOne(transactionExternalId);
  }

  @Post()
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<CreatedTransactionDto> {
    return this.appService.create(createTransactionDto);
  }
}
