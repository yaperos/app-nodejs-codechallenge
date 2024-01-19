import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionDto } from './dto/create-transaction.dto';
import { TransactionStatusDto } from './dto/transaction-status.dto';

@Controller()
export class AppController {
  public constructor(private readonly appService: AppService) {}
  @MessagePattern('topic_created')
  public async validateTransaction(@Payload() dto: TransactionDto,): Promise<void> {
    const status = this.appService.validateTransaction(dto);
        const transactionStatus: TransactionStatusDto = {
      transactionExternalId: dto.transactionExternalId,
      transactionStatus: { name: status },
      transactionType: { name: dto.transferTypeId.toString() },
      value: dto.value,
      createdAt: new Date().toISOString(),
    };
    await this.appService.sendTransactionStatus(transactionStatus);
  }
}