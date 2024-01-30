import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import {
  CreateExternalTransactionDto,
  CreateInternalTransactionDto,
} from './dto';
import {
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { ConsumeTransactionDto } from './dto/comsume-transaction.dto';
const TransactionTypes = {
  Internal: 1,
  External: 2,
};

@Controller('transactions')
export class TransactionController {
  constructor(
    private transactionService: TransactionService,
  ) {}

  @Get('/user/:userId')
  getTransactionsByUser(
    @Param('userId', ParseUUIDPipe)
    userId: string,
  ) {
    return this.transactionService.getTransactionsByUser(
      userId,
    );
  }
  @Get()
  getTransactions() {
    return this.transactionService.getAll();
  }
  @Get(':id')
  getTransactionById(
    @Param('id')
    transactionId: string,
  ) {
    return this.transactionService.getTransactionById(
      transactionId,
    );
  }

  @Post()
  async createTransaction(
    @Body()
    dto:
      | CreateInternalTransactionDto
      | CreateExternalTransactionDto,
  ) {
    let transaction;

    switch (dto.tranferTypeId) {
      case TransactionTypes.Internal:
        transaction =
          await this.transactionService.createTransaction(
            dto as CreateInternalTransactionDto,
          );
        break;
      case TransactionTypes.External:
        transaction =
          await this.transactionService.createExternalTransaction(
            dto as CreateExternalTransactionDto,
          );
        break;
      default:
        throw new BadRequestException(
          'Unrecognized Transaction Type',
        );
    }

    return transaction;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteTransactionById(
    @Param('id')
    transactionId: string,
  ) {
    return this.transactionService.deleteTransactionById(
      transactionId,
    );
  }

  @MessagePattern('transaction-status-update')
  async updateTransactionStatus(
    @Payload() transaction: ConsumeTransactionDto,
  ): Promise<any> {
    try {
      console.log('received status', transaction);
      await this.transactionService.setTransactionStatus(
        transaction.transactionId,
        transaction.status,
      );
      return transaction;
    } catch (error) {
      console.error(
        'Error processing transaction:',
        error,
      );
      throw new Error(
        'Failed to process transaction',
      );
    }
  }
}
