import { 
  Injectable, 
  Inject,    
  Logger,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  EVENT_CREATE_TRANSACTION_REQUEST,
  EVENT_GET_TRANSACTION_REQUEST,
  TRANSACTION_SERVICE,
} from '../../../../@shared';
import {
  TransactionRes,
  CreateTransactionReq,
} from './dto';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    @Inject(TRANSACTION_SERVICE) private readonly transactionClient: ClientKafka,
  ) {}

  onModuleInit() {
    this.transactionClient.subscribeToResponseOf(EVENT_CREATE_TRANSACTION_REQUEST);
    this.transactionClient.subscribeToResponseOf(EVENT_GET_TRANSACTION_REQUEST);
  }

  async create(
    value: CreateTransactionReq,
  ): Promise<TransactionRes> {
    const response = await this._emitAndWait<TransactionRes>(EVENT_CREATE_TRANSACTION_REQUEST, {
      ...value,
    });
    return response;
  }

  async getByExternalId(
    transactionExternalId: string,
  ): Promise<TransactionRes> {
    const response = await this._emitAndWait<TransactionRes>(EVENT_GET_TRANSACTION_REQUEST, {
      transactionExternalId,
    });
    return response;
  }

  private async _emitAndWait<T>(topic: string, value: Record<string, unknown>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.transactionClient
      .send(topic, {
          value,
      })
      .subscribe({
        next: (response) => {
          return resolve(response);
        },
        error: (err) => {
          this.logger.error(
            `[${topic}] = Error sending message to kafka`,
            err,
          );
          return reject(err);
        },        
      });
    })
  }
}
