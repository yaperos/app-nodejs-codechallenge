import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetTransactionDto } from './dto/get-transaction.dto';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);

  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiCreatedResponse({
    type: GetTransactionDto,
  })
  create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<GetTransactionDto> {
    this.logger.debug('transaction request received');
    return this.transactionService.create(createTransactionDto);
  }

  @Get()
  @ApiOkResponse({
    type: GetTransactionDto,
    isArray: true,
  })
  findAll(): Promise<GetTransactionDto[]> {
    return this.transactionService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    type: GetTransactionDto,
  })
  @ApiParam({
    name: 'id',
    type: String,
    example: '60c06d21-9fd2-4de6-89b6-c196c66e9aa2',
  })
  findOne(@Param('id') id: string): Promise<GetTransactionDto> {
    return this.transactionService.findOne(id);
  }
}
