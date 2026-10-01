import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Res,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { toTransactionResponse } from './transaction.mapper';
import { TransactionsService } from './transactions.service';

const MAX_IDEMPOTENCY_KEY_LENGTH = 255;

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiHeader({
    name: 'Idempotency-Key',
    required: false,
    description:
      'Optional. Retrying with the same key returns the original transaction instead of creating a new one',
  })
  @ApiCreatedResponse({
    type: TransactionResponseDto,
    description: 'Created in pending status; anti-fraud decides asynchronously',
  })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  @ApiUnprocessableEntityResponse({
    description: 'Idempotency-Key reused with a different body',
  })
  async create(
    @Body() dto: CreateTransactionDto,
    @Headers('idempotency-key') idempotencyKey: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ): Promise<TransactionResponseDto> {
    if (
      idempotencyKey !== undefined &&
      (idempotencyKey.trim() === '' ||
        idempotencyKey.length > MAX_IDEMPOTENCY_KEY_LENGTH)
    ) {
      throw new BadRequestException([
        `Idempotency-Key must be 1-${MAX_IDEMPOTENCY_KEY_LENGTH} characters`,
      ]);
    }
    const { transaction, replayed } = await this.service.create(
      dto,
      idempotencyKey,
    );
    if (replayed) res.setHeader('Idempotent-Replayed', 'true');
    return toTransactionResponse(transaction);
  }

  @Get(':transactionExternalId')
  @ApiOkResponse({ type: TransactionResponseDto })
  @ApiBadRequestResponse({ description: 'Malformed id' })
  @ApiNotFoundResponse()
  async findOne(
    @Param('transactionExternalId', new ParseUUIDPipe())
    transactionExternalId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<TransactionResponseDto> {
    const { response, cacheHit } = await this.service.findResponse(
      transactionExternalId,
    );
    res.setHeader('X-Cache', cacheHit ? 'HIT' : 'MISS');
    return response;
  }
}
