import { Injectable, Inject } from '@nestjs/common';
import { CreateTransactionEventDto } from './application/adapters/create-transaction.event.dto';
import { TransactionStatus } from './domain/constants/transactionstatus.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {

  constructor(
    @Inject(ConfigService) 
    private readonly configService : ConfigService
  ){}

  transactionValidation(data: CreateTransactionEventDto): CreateTransactionEventDto {
    data.transactionStatus = data.value > this.configService.get<number>('LIMIT-TO-REJECT') ? TransactionStatus.REJECTED : TransactionStatus.APPROVED;
    return data;
  }

}
