import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { KafkaService } from 'nestjs-rdkafka/dist/kafka/services/kafka.service';
import { CreateTransactionRequest } from '../dto/create-transaction-request.dto';
import { TransactionCreatedEvent } from '../transaction-created.event';
import { PARAMETER } from '../constants/app.constant';


@Injectable()
export class AppService {
  constructor (
    @Inject('CLIENT_SERVICE') private readonly client: ClientKafka,private readonly kafkaService: KafkaService
  ){}

  createTransaction(createTransactionRequest: CreateTransactionRequest) {

    console.log("crt      > ", JSON.stringify(createTransactionRequest))

    const {
      accountExternalIdDebit,
      accountExternalIdCredit,
      tranferTypeId,
      AmountValue,
    } = createTransactionRequest;

    //if (valueTransaction>PARAMETER.MAX_VALUE)throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);

    this.client.emit(
      'transaction_created',
      new TransactionCreatedEvent(
        accountExternalIdDebit,
        accountExternalIdCredit,
        tranferTypeId,
        AmountValue,
      ),
    );
    return {
      process: 'transaction_created',
      status: true,
    };
  }

  // async producex(topic:any, xValue:any) {

  //   console.log("to produce  t>> ", JSON.stringify(topic))
  //   console.log("to produce  v>> ", JSON.stringify(xValue))

  //   this.client.emit(
  //     JSON.stringify(topic),

  //       JSON.stringify({
  //         xValue: xValue
  //       }).toString()

  //   );
  //   return {
  //     process: topic,
  //     status: true,
  //   };
  // }
}
