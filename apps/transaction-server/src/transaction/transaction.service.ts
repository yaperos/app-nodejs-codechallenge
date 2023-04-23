import { Injectable,Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateTransactionRequest } from './dto/create-transaction-request.dto';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionResponseEntity } from './entities/transaction.response.entity';
import { TransactionEntity } from './entities/transaction.entity';

@Injectable()
export class TransactionService {

    constructor(
        @Inject('ANTI_FRAUD_SERVICE') private readonly client: ClientKafka,
        private prisma : PrismaService
      ) { }

      async create(createTransactionRequest: CreateTransactionRequest) {

        /*
                Crear la transacción con primsa
                Crear la transacción en redis
                Enviar la transacción a anti-fraud
        */
        // this.client.emit('anti-fraud',
        //   JSON.stringify(createTransactionRequest)
        // );

        let opt = await this.prisma.yapeTransaction.create({
            data: {
                value: createTransactionRequest.value,
                accountExternalIdDebit: createTransactionRequest.accountExternalIdDebit,
                accountExternalIdCredit: createTransactionRequest.accountExternalIdCredit,
                tranferTypeId : createTransactionRequest.tranferTypeId
            }
        })
        
        this.client.emit('anti-fraud',JSON.stringify(opt));
    
        return new TransactionResponseEntity(opt);
    }

    async findOne(id: string) {
        /*
            Buscar la transacción en redis
            Si no existe, buscarla en prisma
            Si no existe, retornar un error
        */
        return new TransactionResponseEntity(await this.prisma.yapeTransaction.findUnique({
            where: {
                transactionExternalId: id
            }
        }));
        // return await this.prisma.yapeTransaction.findUnique({
        //     where: {
        //         transactionExternalId: id
        //     }
        // })
    }
}
