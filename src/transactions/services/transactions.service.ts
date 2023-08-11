import { TransactionDto, TransactionUpdateDto } from './../dto/transaction.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { ErrorManager } from 'src/utils/error.manager';
import { CreateTransactionInputDto } from '../dto/create-post.input';
import { ProducerService } from 'src/kafka/producer.service';

@Injectable()
export class TransactionsService {
    constructor(
        private readonly producerService: ProducerService,

        @InjectRepository(Transaction)
        private readonly transactionRepository: Repository<Transaction>

        
    ){}

    public async createTransaction(body: CreateTransactionInputDto):Promise<Transaction>{
        try {
            const transactionSaved = await this.transactionRepository.save(body)
            await this.producerService.produce({
                topic: 'test',
                messages: [
                    {
                        value:  String(transactionSaved.value),
                        key: String(transactionSaved.id)
                    }
                ]
            })
            return transactionSaved
        } catch (error) {   
            throw new Error(error)
        }
    }

    public async findTransaction():Promise<Transaction[]>{
        try {
            const transaction: Transaction[] = await this.transactionRepository.find()
            if(transaction.length === 0){
                throw new ErrorManager({
                    type: 'BAD_REQUEST',
                    message: 'No se encontro resultado'
                })
            }
            return transaction
        } catch (error) {   
            throw new ErrorManager.createSignatureError(error.message)
        }
    }

    public async findByIdTransaction(id:string):Promise<Transaction>{
        try {
            const transaction:Transaction  = await this.transactionRepository
                .createQueryBuilder('transaction')
                .where({id})
                .getOne();

            if(!transaction){
                throw new ErrorManager({
                    type: 'BAD_REQUEST',
                    message: 'No se encontro resultado'
                })  
            }
            return transaction
        } catch (error) {   
            throw new Error(error)

        }
    }

    public async updateTransaction(id:string,body:TransactionUpdateDto):Promise<UpdateResult | undefined>{
        try {
            const transaction = await this.transactionRepository.update(id,body)
            if(transaction.affected === 0){
                throw new ErrorManager({
                    type: 'BAD_REQUEST',
                    message: 'No se pudo actualizar'
                })
            } return transaction    
        } catch (error) {   
            throw new Error(error)
        }
    }
}
