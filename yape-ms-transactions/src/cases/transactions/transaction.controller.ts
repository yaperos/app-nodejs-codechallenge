import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

/* Project */
import { TransactionService } from './transaction.service';
import { CreateTransactionDto, RetrieveTransactionDto } from './dtos';
import { TransactionProto } from '../../common/constants/grpc.constants';

@Controller(TransactionProto.package)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @GrpcMethod(TransactionProto.service, 'CreateTransaction')
  async createTransaction(payload: CreateTransactionDto) {
    return await this.transactionService.createTransaction(payload);
  }

  @GrpcMethod(TransactionProto.service, 'RetrieveTransaction')
  async retrieveTransaction(payload: RetrieveTransactionDto) {
    return await this.transactionService.retrieveTransaction(payload);
  }
}
