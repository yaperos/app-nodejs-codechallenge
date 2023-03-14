import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionPattern } from '@core/config/types';
import { PageOptionsDto } from '../../core/types/pagination';

@Controller()
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);

  constructor(private readonly transactionService: TransactionService) {}

  @MessagePattern(TransactionPattern.CREATE_TRANSACTION)
  create(@Payload() createTransactionDto: CreateTransactionDto) {
    this.logger.log(`MESSAGE PATTERN ${TransactionPattern.CREATE_TRANSACTION}`);
    return this.transactionService.createTransaction(createTransactionDto);
  }

  @MessagePattern(TransactionPattern.LIST_TRANSACTION)
  getAllTransactions(@Payload() pageOptionsDto: PageOptionsDto) {
    this.logger.log(`MESSAGE PATTERN ${TransactionPattern.LIST_TRANSACTION}`);
    return this.transactionService.getAllTransactions(pageOptionsDto);
  }

  @MessagePattern(TransactionPattern.FIND_ONE_TRANSACTION)
  findTransaction(@Payload() transactionExternalId: string) {
    this.logger.log(
      `MESSAGE PATTERN ${TransactionPattern.FIND_ONE_TRANSACTION}`,
    );
    return this.transactionService.findOne(transactionExternalId);
  }

  @MessagePattern(TransactionPattern.APPROVED_TRANSACTION)
  approvedTransaction(@Payload() updateTransactionDto: UpdateTransactionDto) {
    this.logger.log(
      `MESSAGE PATTERN ${TransactionPattern.APPROVED_TRANSACTION}`,
    );
    return this.transactionService.approvedTransaction(updateTransactionDto);
  }

  @MessagePattern(TransactionPattern.REJECTED_TRANSACTION)
  rejectedTransaction(@Payload() updateTransactionDto: UpdateTransactionDto) {
    this.logger.log(
      `MESSAGE PATTERN ${TransactionPattern.REJECTED_TRANSACTION}`,
    );
    return this.transactionService.rejectedTransaction(updateTransactionDto);
  }
}
