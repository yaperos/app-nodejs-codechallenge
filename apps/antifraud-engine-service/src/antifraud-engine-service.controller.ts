import { 
  Controller,
  UseFilters,
  UsePipes, 
} from '@nestjs/common';
import { AntifraudEngineServiceService } from './antifraud-engine-service.service';
import { MessagePattern, Payload, Ctx, KafkaContext, EventPattern } from '@nestjs/microservices';
import {
  KafkaExceptionFilter,
  EVENT_GET_PENDING_TRANSACTION_REQUEST,
  KafkaValidationPipe,
} from '../../@shared';
import {
  GetPendingTransactionReq,
  GetPendingTransactionMessageDTO,
} from './dto';
@Controller()
export class AntifraudEngineServiceController {
  constructor(
    private readonly antifraudEngineServiceService: AntifraudEngineServiceService
  ) {}

  @EventPattern(EVENT_GET_PENDING_TRANSACTION_REQUEST)
  @UsePipes(new KafkaValidationPipe())
  @UseFilters(new KafkaExceptionFilter())
  async getantifraudFeaturesForPendingTransactions(
    @Payload() message: GetPendingTransactionReq,
    @Ctx() context: KafkaContext,
  ): Promise<void> {
    void this.antifraudEngineServiceService.getAntifraudFeatures(message.transactionId);
  }
}
