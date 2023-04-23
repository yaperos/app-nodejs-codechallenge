import { Injectable,Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateTransactionRequest } from './dto/create-transaction-request.dto';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionResponseEntity } from './entities/transaction.response.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache as CacheManager } from 'cache-manager';
import { YapeTransaction } from '@prisma/client';
@Injectable()
export class TransactionService {

    constructor(
        @Inject('ANTI_FRAUD_SERVICE') private readonly client: ClientKafka,
        private prisma : PrismaService,
        @Inject(CACHE_MANAGER) private cacheManager: CacheManager
      ) { }

      async create(createTransactionRequest: CreateTransactionRequest) {

        /*
                Crear la transacción con prisma
                Crear la transacción en redis
                Enviar la transacción a anti-fraud
        */

        let opt = await this.prisma.yapeTransaction.create({
            data: {
                value: createTransactionRequest.value,
                accountExternalIdDebit: createTransactionRequest.accountExternalIdDebit,
                accountExternalIdCredit: createTransactionRequest.accountExternalIdCredit,
                tranferTypeId : createTransactionRequest.tranferTypeId
            }
        })

        await this.cacheManager.set(opt.transactionExternalId, opt);
        
        this.client.emit('anti-fraud',JSON.stringify(opt));
    
        return new TransactionResponseEntity(opt);
    }

    async findOne(id: string) {
        /*
            Buscar la transacción en redis
            Si no existe, buscarla en prisma
            Si no existe, retornar un error
        */
        const value: YapeTransaction  = await this.cacheManager.get(id);
        if(value) {
            console.log("corre cache");
            return new TransactionResponseEntity(value);
        }

        return new TransactionResponseEntity(await this.prisma.yapeTransaction.findUnique({
            where: {
                transactionExternalId: id
            }
        }));
    }
}
