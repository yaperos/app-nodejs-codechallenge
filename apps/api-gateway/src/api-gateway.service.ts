import { START_TRANSACTION_CREATED } from '@app/common/constans/topics';
import { RequestData } from '@app/common/interfaces';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { TRANSACTION_SERVICE } from './constans/services';
import { CreateTransactionDto } from './dto/create-trasaction.dto';

@Injectable()
export class ApiGatewayService {
  constructor(
    @Inject(TRANSACTION_SERVICE) private transactionClient: ClientKafka,
  ) {}

  async createTransaction(transactionDto: CreateTransactionDto) {
    try {
      await lastValueFrom(
        this.transactionClient.emit<string, RequestData<CreateTransactionDto>>(
          START_TRANSACTION_CREATED,
          { payload: transactionDto },
        ),
      );

      return 'OK';
    } catch (error) {
      throw new InternalServerErrorException('Error al crear Transacion');
    }
  }
}
