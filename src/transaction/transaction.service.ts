import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entity/transaction.entity';
import { CreateTransactionInput, UpdateTransactionInput } from './dto/inputs';
import { Repository } from 'typeorm';
import { TransactionStatus } from './enums/transaction-status.enum';
import { TranferType } from './enums/transfer-type.enum';
import { TransactionType } from './enums/transaction-type.enum';
import { ClientProxy } from '@nestjs/microservices';
import { PaginationArgs, SearchArgs } from 'src/common/dto/arg';
import { ConfigurationEnum } from '../config/config.keys';
import { ConfigService } from '../config/config.service';

@Injectable()
export class TransactionService {

    constructor(
        
        private readonly configService: ConfigService,

        @InjectRepository( Transaction )
        private readonly transactionRepository: Repository<Transaction>,

        @Inject('KAFKA')
        private readonly kafka: ClientProxy
    ){}

    async create(createTransactionInput: CreateTransactionInput ): Promise<Transaction> {

        const transaction = new Transaction();
        if(!createTransactionInput.accountExternalIdCredit) transaction.transactionExternalId =  createTransactionInput.accountExternalIdDebit
        else transaction.transactionExternalId =  createTransactionInput.accountExternalIdCredit
        
        switch (createTransactionInput.tranferTypeId) {
            case TranferType.instant:
                transaction.transactionType = TransactionType.instant;
                break;
            case TranferType.ordinary:
                transaction.transactionType = TransactionType.ordinary;
                break;
            case TranferType.urgent:
                transaction.transactionType = TransactionType.urgent;
                break;
            default:
                transaction.transactionType = TransactionType.ordinary;
                break;
        }
        transaction.transactionStatus = TransactionStatus.pending;
        transaction.value = createTransactionInput.value;

        const newTransaction = this.transactionRepository.create( transaction );  
        const transactionCreated = await this.transactionRepository.save( newTransaction );
        const topic = this.configService.get(ConfigurationEnum.TOPIC_MESSAGE);
        await this.kafka.emit(topic, {transactionCreated});
        return transactionCreated; 

    }

    
    async findOne(id: string ): Promise<Transaction> {
        const transaction = await this.transactionRepository.findOneBy({
            id
        });
        return transaction
    }

    async findAll( paginationArgs: PaginationArgs, searchArgs: SearchArgs ): Promise<Transaction[]> {

        const { limit, offset } = paginationArgs;
        const { search } = searchArgs;

        const queryBuilder = this.transactionRepository.createQueryBuilder()
          .take( limit )
          .skip( offset );
    
        if ( search ) {
          queryBuilder.andWhere('transactionExternalId ILIKE :transactionExternalId', { transactionExternalId: `%${search}%` });
        }
    
        return queryBuilder.getMany();
      }

      
    async update( id: string, transactionStatus: TransactionStatus ): Promise<Transaction> {
        const transactionUpdate = new UpdateTransactionInput();
        transactionUpdate.id = id;
        transactionUpdate.transactionStatus = transactionStatus;

        const transaction = await this.transactionRepository.preload( transactionUpdate );
      
        if ( !transaction ) throw new NotFoundException(`Item with id: ${ id } not found`);
      
        return await this.transactionRepository.save( transaction );    
      
    }
}
