import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  ClientModuleRegister,
  TransactionStatus,
} from 'src/core/helpers/constants';
import { TransactionVerifyRepository } from '../domain/repositories/transaction-verify.repository';
import {
  TransactionVerifyRequest,
  TransactionVerifyUpdateRequest,
} from '../domain/entities/transaction-verify-request';
import { TransactionVerify } from '../domain/aggregates/transaction-verify';
import { TransactionVerifyEntity } from './entities/transaction-verify.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionVerifyDto } from './dto/transaction-verify.dto';
import { TransactionVerifyEmitterRequest } from '../domain/entities/transaction-validation-emitter-request';
import { Observable } from 'rxjs';

@Injectable()
export class TransactionVerifyInfrastructure
  implements TransactionVerifyRepository
{
  constructor(
    @Inject(ClientModuleRegister)
    private readonly kafkaAuthClient: ClientKafka,
    @InjectRepository(TransactionVerifyEntity)
    private readonly transactionVerifyRepository: Repository<TransactionVerifyEntity>,
    private readonly logger: Logger,
  ) {}

  async saveTransactionVerify(
    transactionVerifyRequest: TransactionVerifyRequest,
  ): Promise<TransactionVerify> {
    const transactionEntity = TransactionVerifyDto.fromDomainToEntity(
      transactionVerifyRequest,
    );

    const transactionVerifyResult = await this.transactionVerifyRepository.save(
      transactionEntity,
    );
    const transactionVerifyResponse = TransactionVerifyDto.fromDataToDomain(
      transactionVerifyResult,
    );

    return transactionVerifyResponse;
  }

  async updateTransactionVerify(
    transactionVerifyUpdate: TransactionVerifyUpdateRequest,
  ): Promise<void> {
    const transactionVerify = await this.transactionVerifyRepository.findOne({
      where: {
        transactionExternalId: transactionVerifyUpdate.transactionExternalId,
      },
    });
    if (!transactionVerify) {
      return null;
    }
    transactionVerify.transactionStatus = {
      id: TransactionStatus[transactionVerifyUpdate.status],
      name: transactionVerifyUpdate.status,
    };
    await this.transactionVerifyRepository.save(transactionVerify);
  }

  async emitterToValidateAntiFraud<T>(
    transactionVerify: TransactionVerifyEmitterRequest,
  ): Promise<Observable<T>> {
    this.logger.log(
      `Emit to verify anti fraud with values : ${JSON.stringify(
        transactionVerify,
      )}`,
    );
    return this.kafkaAuthClient.emit(
      process.env.CLIENT_TRANSACTION_VERIFY_MS,
      JSON.stringify(transactionVerify),
    );
  }

  async findTransactionVerifyById(
    transactionExternalId: string,
  ): Promise<TransactionVerify> {
    const transactionVerify = await this.transactionVerifyRepository.findOne({
      where: {
        transactionExternalId,
      },
    });
    if (!transactionVerify) {
      return null;
    }
    const transactionVerifyResponse =
      TransactionVerifyDto.fromDataToDomain(transactionVerify);
    return transactionVerifyResponse;
  }
}
