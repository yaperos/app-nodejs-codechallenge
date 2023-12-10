import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { IncomingTransactionDto } from './incoming-transaction.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('transaction_created')
  verifyTransaction(@Payload() incomingTransactionDto: IncomingTransactionDto) {
    return this.appService.verifyTransaction(incomingTransactionDto);
  }
}
