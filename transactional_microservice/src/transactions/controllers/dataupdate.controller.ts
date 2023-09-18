import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EmitedUpdateTransactionDto } from '../dto/emited_update_transaction.dto';
import { DataupdateService } from '../services/dataupdate.service';

@Controller()
export class DataupdateController {
  constructor(private readonly dataupdateService: DataupdateService) {}

  @MessagePattern('transaction.validate')
  updateTransaction(@Payload() payload: EmitedUpdateTransactionDto): void {
    this.dataupdateService.runUpdateStatusTransaction(payload);
  }
}
