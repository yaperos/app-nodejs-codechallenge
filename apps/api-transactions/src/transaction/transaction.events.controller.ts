import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('transaction')
export class TransactionController {
  @MessagePattern('transaction.approved')
  handleTransactionApproved(@Payload() message) {
    console.log(message);
  }

  @MessagePattern('transaction.rejected')
  handleTransactionRejected(@Payload() message) {
    console.log(message);
  }
}
