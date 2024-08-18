import {
  Controller,
  Body,
  Post,
  Get,
  Param,
  ValidationPipe,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { TransactionDTO } from '../dtos/transaction.dto';
import { TransactionsService } from '../services/transactions.service';
import {
  TransactionCreateResponse,
  TransactionResponseDto,
} from 'src/dtos/transaction-response.dto';
import { TransactionIdParamDto } from 'src/dtos/tansactionId-param.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UpdateTransactionDto } from 'src/dtos/update-transaction.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/providers/jwt-auth-guard.provider';
@ApiTags('Transaction')
@Controller('transactions')
export class TransactionsController {
  private readonly logger = new Logger('TransactionsController');
  constructor(private transactionService: TransactionsService) {}

  @ApiResponse({
    status: 201,
    description: 'Create Transaction',
    type: TransactionCreateResponse,
  })

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() 
  @Post()
  async create(@Body() transaction: TransactionDTO): Promise<TransactionDTO> {
    return await this.transactionService.createTransaction(transaction);
  }

  @ApiOperation({ summary: 'Get Transaction By TransactionExternalId' })
  @ApiResponse({ status: 200, description: 'List Transaction.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiParam({
    name: 'transactionExternalId',
    type: 'string',
    description: 'TransactionExternalId Of Transaction',
  })

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() 
  @Get(':transactionExternalId')
  async getTransaction(
    @Param(new ValidationPipe()) params: TransactionIdParamDto,
  ): Promise<TransactionResponseDto> {
    const { transactionExternalId } = params;

    return this.transactionService.getTransactionByExternalId(
      transactionExternalId,
    );
  }

  @MessagePattern('transaction-update')
  async handleEventUpdateTransaction(
    @Payload() data: UpdateTransactionDto,
  ): Promise<TransactionDTO> {
    const transaction = await this.transactionService.update(data);
    this.logger.debug(JSON.stringify(transaction));
    return transaction;
  }
}
