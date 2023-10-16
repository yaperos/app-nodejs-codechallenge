import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import {
  TransactionRequestDto,
  TransactionResponse,
  TransactionValidatedDto,
} from './dto/transaction.dto';
import { Logger } from '@logger/logger.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { UPDATE_TRANSACTION_STATUS } from 'constants/kafka-topics';

@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly logger: Logger,
    private readonly transactionService: TransactionService,
  ) {}

  @Post()
  async createTransaction(
    @Body() transactionDto: TransactionRequestDto,
  ): Promise<TransactionResponse> {
    try {
      this.logger.log(`Start create transaction`);
      const response =
        await this.transactionService.createTransaction(transactionDto);
      this.logger.log(
        `Transaction created successfully - TransactionId: ${response.transactionExternalId}`,
      );
      return response;
    } catch (e) {
      this.logger.error('Error creating transaction', e.message);
      throw new Error(e);
    }
  }

  @Get(':id')
  async searchTransaction(
    @Param('id') id: string,
  ): Promise<TransactionResponse> {
    try {
      this.logger.log(`Start search transaction`);
      const response = await this.transactionService.searchTransaction(id);
      this.logger.log(
        `Transaction fetched successfully - TransactionId: ${response.transactionExternalId}`,
      );
      return response;
    } catch (e) {
      this.logger.error('Error fetching transaction', e.message);
      throw new Error(e);
    }
  }

  @EventPattern(UPDATE_TRANSACTION_STATUS)
  async handleUpdateTransactionStatus(
    @Payload(ValidationPipe) transactionValidatedDto: TransactionValidatedDto,
  ) {
    try {
      const { status, transactionId } = transactionValidatedDto;
      this.logger.log(
        `Starting transaction validation for ID ${transactionId}`,
      );
      await this.transactionService.updateTransaction(transactionId, status);
      this.logger.log('Transaction validated successfully');
    } catch (e) {
      this.logger.error(
        'Error in handleTransactionAmountValidation',
        e.message,
      );
      throw new Error(e);
    }
  }
}
