import { Injectable,Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateTransactionRequest } from './dto/create-transaction-request.dto';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionResponseEntity } from './entities/transaction.response.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache as CacheManager } from 'cache-manager';
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
            select: {
                transactionExternalId: true,
                value: true,
                createdAt: true,
                transactionType: {
                  select: {
                    name: true
                  }
                },
                transactionStatus: {
                  select: {
                    name: true
                  }
                }
            },
            data: {
                value: createTransactionRequest.value,
                accountExternalIdDebit: createTransactionRequest.accountExternalIdDebit,
                accountExternalIdCredit: createTransactionRequest.accountExternalIdCredit,
                tranferTypeId : createTransactionRequest.tranferTypeId
            },
        })

        await this.cacheManager.set(opt.transactionExternalId, opt);
        
        this.client.emit('anti-fraud',JSON.stringify(opt));
    
        return opt;
    }


    async findOne(id: string) {
        /*
            Buscar la transacción en redis
            Si no existe, buscarla con prisma
            Si no existe, retornar un error
        */
        const value = await this.cacheManager.get(id);
        
        if(value) return value;

        return await this.prisma.yapeTransaction.findUnique({
            where: {
                transactionExternalId: id
            },
            select: {
                transactionExternalId: true,
                value: true,
                createdAt: true,
                transactionType: {
                  select: {
                    name: true
                  }
                },
                transactionStatus: {
                  select: {
                    name: true
                  }
                }
              }
        })
    }
}
