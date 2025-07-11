import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ValidationPipe,
  UsePipes,
  HttpStatus,
  HttpCode,
  Inject,
} from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateTransactionUseCase } from '../../domain/usecases/create-transaction.usecase';
import { GetTransactionUseCase } from '../../domain/usecases/get-transaction.usecase';
import { UpdateTransactionStatusUseCase } from '../../domain/usecases/update-transaction-status.usecase';
import { CreateTransactionDto } from '../../domain/dto/create-transaction.dto';
import { TransactionResponseDto } from '../../domain/dto/transaction-response.dto';
import { TransactionStatusUpdateMessageDto } from '../../domain/dto/transaction-status-update-message.dto';
import { TransactionStatus } from '../../domain/enums/transaction.enums';
import { TransactionMapper } from '../../presentation/mappers/transaction.mapper';
import { KAFKA_PATTERNS } from '../kafka/kafka.config';

@Controller('transactions')
export class TransactionController {
  constructor(
    @Inject('CreateTransactionUseCase')
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    @Inject('GetTransactionUseCase')
    private readonly getTransactionUseCase: GetTransactionUseCase,
    @Inject('UpdateTransactionStatusUseCase')
    private readonly updateTransactionStatusUseCase: UpdateTransactionStatusUseCase,
    private readonly transactionMapper: TransactionMapper,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    const transaction =
      await this.createTransactionUseCase.execute(createTransactionDto);

    return this.transactionMapper.toResponseDto(transaction);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getTransaction(
    @Param('id') id: string,
  ): Promise<TransactionResponseDto> {
    const transaction = await this.getTransactionUseCase.execute(id);

    return this.transactionMapper.toResponseDto(transaction);
  }

  @EventPattern(KAFKA_PATTERNS.TRANSACTION_STATUS_UPDATED)
  async handleTransactionStatusUpdate(
    @Payload() message: TransactionStatusUpdateMessageDto,
  ): Promise<void> {
    try {
      const { transactionId, status } = message;

      await this.updateTransactionStatusUseCase.execute(
        transactionId,
        status as TransactionStatus,
      );
    } catch (error) {
      console.error('Error handling status update:', error);
      throw error;
    }
  }
}
