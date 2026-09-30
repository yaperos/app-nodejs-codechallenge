import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { toTransactionResponse } from './transaction.mapper';
import { TransactionsService } from './transactions.service';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    type: TransactionResponseDto,
    description: 'Created in pending status; anti-fraud decides asynchronously',
  })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  async create(
    @Body() dto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    return toTransactionResponse(await this.service.create(dto));
  }

  @Get(':transactionExternalId')
  @ApiOkResponse({ type: TransactionResponseDto })
  @ApiBadRequestResponse({ description: 'Malformed id' })
  @ApiNotFoundResponse()
  async findOne(
    @Param('transactionExternalId', new ParseUUIDPipe())
    transactionExternalId: string,
  ): Promise<TransactionResponseDto> {
    return toTransactionResponse(
      await this.service.findById(transactionExternalId),
    );
  }
}
