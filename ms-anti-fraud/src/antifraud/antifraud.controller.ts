import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AntifraudService } from './antifraud.service';
import { RequestTransactionDto } from './dto/request-transaction';
import { ResponseTransactionDto } from './dto/response-transaction';

@Controller('antifraud')
export class AntifraudController {
  constructor(private readonly antifraudService: AntifraudService) {}

  @MessagePattern('validate_transaction')
  public async handleTransactionCreated(
    @Payload() transaction: RequestTransactionDto,
  ): Promise<ResponseTransactionDto> {
    console.log('validate_transaction', transaction);
    return this.antifraudService.validateTransaction(transaction);
  }
}
