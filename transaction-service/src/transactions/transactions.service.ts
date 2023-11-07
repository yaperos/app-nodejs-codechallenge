import { Injectable } from '@nestjs/common';
import { RetrieveTransaction } from './post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionInput } from './dto/create-transaction.input';

@Injectable()
export class TransactionsService {
    constructor(@InjectRepository(RetrieveTransaction) private transactionRepository: Repository<RetrieveTransaction>){}

    async retrieve(id: string): Promise<RetrieveTransaction>{
      /* const p = await this.transactionRepository.findOne({
            where: {
                transactionExternalId: id
            }
        })

        //console.log(p)*/

        return {
            transactionExternalId: 21,
            transactionType: {
                id: 1,
                name: ''
            },
            transactionStatus: {
                id: 1,
                name: ''
            },
            value: 12,
            createdAt: new Date()
        }
    }

    async transaction(data: CreateTransactionInput): Promise<RetrieveTransaction>{
        try {
            const transaction = await this.transactionRepository.create({
                transactionStatus: {
                    name: 'PENDING'
                },
                transactionType: {
                    name: '' //data.tranferTypeId
                },
                value: data.value
            })
    
           await this.transactionRepository.save(transaction)
           return {
            transactionExternalId: 21,
            transactionType: {
                id: 1,
                name: ''
            },
            transactionStatus: {
                id: 1,
                name: ''
            },
            value: 12,
            createdAt: new Date()
        }
        } catch (error) {
            console.log(error)
            throw error
        }
       
    }
}
