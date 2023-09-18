import { Controller } from '@nestjs/common';
import { AntifraudService } from '../services/antifraud.service';
import { EmitedCreateTransactionDto } from '../dto/emited_create_transaction.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AntifraudController {
  constructor(private readonly antifraudService: AntifraudService) {}

  @MessagePattern('transaction.create')
  public createMessage(@Payload() payload: EmitedCreateTransactionDto): void {
    this.antifraudService.runValidateTransaction(payload);
  }
}
