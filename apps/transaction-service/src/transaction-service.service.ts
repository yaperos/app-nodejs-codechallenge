import { 
  Injectable, 
  Inject, 
  CACHE_MANAGER,
} from '@nestjs/common';
import { 
  Repository,
} from 'typeorm';
import {
  InjectRepository,
} from '@nestjs/typeorm';
import {
  ClientKafka,
  RpcException,
} from '@nestjs/microservices';
import {
  Transaction,
} from './db';
import { v4 as uuidv4, } from 'uuid';
import {
  CreateTransactionReq,
  AntifraudReq,
  TransactionCreatedResponseDTO,
} from './dto';
import {
  Feature,
  TransactionStatus,
  transferTypes,
  EVENT_GET_PENDING_TRANSACTION_REQUEST,
  ANTIFRAUD_SERVICE,
  transactionStatus,
  transferTypeName,
} from '../../../@shared';
import {
  Cache,
} from 'cache-manager';

@Injectable()
export class TransactionServiceService {

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(ANTIFRAUD_SERVICE) private readonly antifraudEngineClient: ClientKafka,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async getByExternalId(
    transactionExternalId: string,
  ): Promise<TransactionCreatedResponseDTO> {
    let transaction = await this.cacheManager.get<Transaction>(
      transactionExternalId,
    );
    if (!transaction) {
      transaction = await this.transactionRepository.findOne({
        where: {
          transactionExternalId,
        }
      });
      void this.cacheManager.set(transactionExternalId, transaction);
    }
    return this._mapResponse(transactionExternalId, transaction);
  }

  async create(
    body: CreateTransactionReq,
  ): Promise<TransactionCreatedResponseDTO> { 
    if (!transferTypes.includes(body.tranferTypeId)) {
      throw new RpcException('no transfer type allowed');
    }
    const transactionExternalId = uuidv4();
    const model = this.transactionRepository.create({
      transactionExternalId,
      value: body.value,
      transactionStatusId: TransactionStatus.PENDING,
      accountExternalIdDebit: body.accountExternalIdDebit,
      accountExternalIdCredit: body.accountExternalIdCredit,
      transactionTypeId: body.tranferTypeId,
    });
    const result = await this.transactionRepository.save(model);
    await this.cacheManager.set(transactionExternalId, result);
    void this.antifraudEngineClient
    .emit(EVENT_GET_PENDING_TRANSACTION_REQUEST, {
      value: {
        transactionId: result.id,
      }
    });
    return this._mapResponse(transactionExternalId, result, body);
  }

  private _mapResponse(
    transactionExternalId: string, 
    transaction: Transaction, 
    body?: CreateTransactionReq,
  ): TransactionCreatedResponseDTO {
    return {
      value: {
        value: transaction?.value,
        transactionExternalId,
        transactionType: {
          name: transferTypeName[transaction?.transactionTypeId ?? body?.tranferTypeId],
        },
        transactionStatus: {
          name: transactionStatus[transaction?.transactionStatusId ?? TransactionStatus.PENDING],
        },
        createdAt: transaction?.createdAt,
      }
    }
  }

  async updateTransactionStatusByAntifraudFeature(
    antifraudReq: AntifraudReq,
  ): Promise<void> {
    const {
      features: antifraudFeatures = [],
      transactionId: id = 0,
    } = antifraudReq;

    if (!id) return;

    const transaction = await this.transactionRepository
    .findOne({
      where: {
        id,
      },
    });
    
    let transactionStatusId = TransactionStatus.APPROVED;
    for (const feature of antifraudFeatures) {
      const code = feature.code;
      const isValid = this._runFeatureEngine(code, transaction);
      if (!isValid) transactionStatusId = TransactionStatus.REJECTED;
    }

    await this.transactionRepository
      .update({
        id,
    }, {
        transactionStatusId,
    });

    await this.cacheManager.del(transaction.transactionExternalId);
    await this.cacheManager.set(transaction.transactionExternalId, {
      ...transaction,
      transactionStatusId,
    });
  }

  private _runFeatureEngine(
    code: string, 
    transaction: Transaction,
  ): boolean {
    return Feature[code](transaction);
  }
}
