import { Controller } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TransactionDto } from './dto/transaction.dto';

@Controller()
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  @EventPattern('transaction-created')
  generatedTransaction(@Payload() transaction: TransactionDto): any {
    return this.service.createTransaction(transaction);
  }

  @EventPattern('transaction-approved')
  approveTransaction(@Payload() { id }: { id: string }): any {
    return this.service.approveTransaction(id);
  }

  @EventPattern('transaction-rejected')
  rejectTransaction(@Payload() { id }: { id: string }) {
    return this.service.rejectTransaction(id);
  }
}
