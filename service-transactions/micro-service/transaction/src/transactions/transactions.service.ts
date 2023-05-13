import {  Injectable,Inject } from '@nestjs/common';
import { PrismaService } from '../../../../src/prisma/prisma.service';
import { TransactionEntity, CreateTransactionInput, RetrieveTransaction } from 'src/graphql';
import {ClientKafka} from "@nestjs/microservices";

@Injectable()
export class TransactionsService {

  constructor(
    @Inject('KAFKA')
    private readonly kafka: ClientKafka,
    private prisma: PrismaService) { }

  async saveTransaction(input: CreateTransactionInput): Promise<TransactionEntity> {
    try {
      let newData = { ...input };
      let response = await this.prisma.transaction.create({ data: newData });
  
      this.kafka.send('transaction_created', JSON.stringify(response)).subscribe( {
        error: (err) => {
            console.log(err)
        },
        next: (data) => {
            console.log('respuesta antifraude',data)

        }
    })

      return response;
    }
    catch (error) {
      return error;
    }

  }


  async find(externalId: number): Promise<RetrieveTransaction> {
    try {
      await this.prisma.transaction.update({
        where: { transactionExternalId: externalId }, data: {
          transactionStatus: 'approved'
        }
      });
      return this.prisma.transaction.findUnique({ where: { transactionExternalId: externalId } });
    }
    catch (error) {
      return error;
    }

  }


}
