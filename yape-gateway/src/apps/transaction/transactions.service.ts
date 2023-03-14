import {
  Injectable,
  Inject,
  OnModuleInit,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  TransactionDataResponse,
  ServerResponse,
  ServerPaginateResponse,
} from '@core/config/types';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { environment } from '@core/config/environment';
import {
  ServerError,
  StatusResponse,
  TransactionPattern,
} from '@core/config/constants';
import { PageDto, PageOptionsDto } from '@core/types/pagination';

@Injectable()
export class TransactionsService implements OnModuleInit {
  private readonly logger = new Logger(TransactionsService.name);
  constructor(
    @Inject(environment.kafkaConfig.name)
    private readonly transactionClient: ClientKafka,
  ) {}

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<ServerResponse<TransactionDataResponse>> {
    this.logger.log(`${TransactionPattern.CREATE_TRANSACTION} EVENT`);

    try {
      const response = await firstValueFrom<TransactionDataResponse>(
        this.transactionClient.send(
          TransactionPattern.CREATE_TRANSACTION,
          JSON.stringify(createTransactionDto),
        ),
      );

      const result: ServerResponse<TransactionDataResponse> = {
        message: response
          ? 'Transaction created'
          : 'Transaction might not have been created',
        status: response ? StatusResponse.OK : StatusResponse.ERROR,
        data: response
          ? {
              transactionExternalId: response.transactionExternalId,
              transactionType: response.transactionType,
              transactionStatus: response.transactionStatus,
              value: response.amount,
              createdAt: response.createdAt,
            }
          : null,
      };

      this.logger.log({
        message: 'Finalized transaction created',
        result,
      });

      return result;
    } catch (error) {
      this.logger.error('ERROR CREATE_TRANSACTION');
      this.logger.error(error);
      throw new InternalServerErrorException(ServerError.INTERNAL_SERVER_ERROR);
    }
  }

  async getTransactions(
    pageOptionsDto: PageOptionsDto,
  ): Promise<ServerPaginateResponse<TransactionDataResponse[]>> {
    this.logger.log(`${TransactionPattern.LIST_TRANSACTION} EVENT`);
    try {
      const { data, meta } = await firstValueFrom<
        PageDto<TransactionDataResponse>
      >(
        this.transactionClient.send(
          TransactionPattern.LIST_TRANSACTION,
          JSON.stringify({ ...pageOptionsDto, skip: pageOptionsDto.skip }),
        ),
      );

      const result: ServerPaginateResponse<TransactionDataResponse[]> = {
        message: data
          ? 'Transactions List'
          : 'Transaction might not have been listed',
        status: data ? StatusResponse.OK : StatusResponse.ERROR,
        data: data ? data : null,
        meta: meta ? meta : null,
      };

      return result;
    } catch (error) {
      this.logger.error('ERROR GET_TRANSACTIONS');
      this.logger.error(error);
      throw new InternalServerErrorException(ServerError.INTERNAL_SERVER_ERROR);
    }
  }

  async getTransactionById(
    transactionExternalId: string,
  ): Promise<ServerResponse<TransactionDataResponse>> {
    this.logger.log(`${TransactionPattern.FIND_ONE_TRANSACTION} EVENT`);
    try {
      const response = await firstValueFrom<TransactionDataResponse>(
        this.transactionClient.send(
          TransactionPattern.FIND_ONE_TRANSACTION,
          transactionExternalId,
        ),
      );

      const result: ServerResponse<TransactionDataResponse> = {
        message: response ? 'Transaction Get' : 'Transaction not found',
        status: response ? StatusResponse.OK : StatusResponse.ERROR,
        data: response ? response : null,
      };
      return result;
    } catch (error) {
      this.logger.error('ERROR GET TRANSACTION BY ID');
      this.logger.error(error);
      throw new InternalServerErrorException(ServerError.INTERNAL_SERVER_ERROR);
    }
  }

  onModuleInit() {
    this.transactionClient.subscribeToResponseOf(
      TransactionPattern.CREATE_TRANSACTION,
    );
    this.transactionClient.subscribeToResponseOf(
      TransactionPattern.LIST_TRANSACTION,
    );
    this.transactionClient.subscribeToResponseOf(
      TransactionPattern.FIND_ONE_TRANSACTION,
    );
  }
}
