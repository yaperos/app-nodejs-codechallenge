import { Controller, Get } from '@nestjs/common';
import { RetriveService } from './retrieve.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { logger } from '../datadog';
import { ITransaction } from '../transaction/dto/create-anti-fraud-service.dto';

@Controller()
export class RetriveController {
  constructor(private readonly retriveService: RetriveService) {}

  @MessagePattern('transactions.rejected')
  async updateRejected(createAntiFraudServiceDto: ITransaction) {
    logger.log('info', {
      message: 'transactions.rejected',
      ...createAntiFraudServiceDto,
    });
    await this.retriveService.updateTransition(createAntiFraudServiceDto);
  }

  @MessagePattern('transactions.approved')
  async updateApproved(createAntiFraudServiceDto: ITransaction) {
    logger.log('info', {
      message: 'transactions.approved',
      ...createAntiFraudServiceDto,
    });
    await this.retriveService.updateTransition(createAntiFraudServiceDto);
  }
}
