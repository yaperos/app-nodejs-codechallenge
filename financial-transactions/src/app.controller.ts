/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { TransactionRequestDto } from './dto/request/transaction.request.dto';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { TransactionStatusRequestDto } from './dto/request/transaction-status.request.dto';
import { CREATE_TRANSACTION_TOPIC, FIND_TRANSACTION_TOPIC, UPDATE_TRANSACTION_STATUS_APPROVED_TOPIC, UPDATE_TRANSACTION_STATUS_REJECTED_TOPIC } from './constans/kakfa-topics';

@Controller('financial-transactions')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @MessagePattern(CREATE_TRANSACTION_TOPIC)
  handleCreateFinancialTransaction(transactionRequestDto: TransactionRequestDto) {
    return this.appService.createFinancialTransaction(transactionRequestDto);
  }

  @MessagePattern(FIND_TRANSACTION_TOPIC)
  handleFindFinancialTransactionByExternalId(transactionExternalId: string) {
    return this.appService.findFinancialTransactionByExternalId(transactionExternalId);

  }

  /**
   * Updating the status of a transaction can be handled with this single listener function,
   * but due to architectural guidelines, the handleTransactionStatusRejected and handleTransactionStatusApproved 
   * functions will be used.
   * @param transactionStatusRequestDto 
   */
  // @EventPattern(UPDATE_TRANSACTION_STATUS_TOPIC)
  // handleTransactionStatus(transactionStatusRequestDto: TransactionStatusRequestDto) {
  //   this.appService.updateStatusTransaction(transactionStatusRequestDto);
  // }

  /**
   * this function listens for the update event of a rejected transaction.
   * @param transactionStatusRequestDto 
   */
  @EventPattern(UPDATE_TRANSACTION_STATUS_REJECTED_TOPIC)
  handleTransactionStatusRejected(transactionStatusRequestDto: TransactionStatusRequestDto) {
    this.appService.updateStatusTransaction(transactionStatusRequestDto);
  }

  /**
   * this function listens for the update event of a approved  transaction.
   * @param transactionStatusRequestDto 
   */
  @EventPattern(UPDATE_TRANSACTION_STATUS_APPROVED_TOPIC)
  handleTransactionStatusApproved(transactionStatusRequestDto: TransactionStatusRequestDto) {
    this.appService.updateStatusTransaction(transactionStatusRequestDto);
  }

}
