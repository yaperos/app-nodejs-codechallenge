import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { Type } from '../type/type.entity';
import { Status } from '../status/status.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto'

@Injectable()
export class TransactionsService {

	constructor(@InjectRepository(Transaction) private transactionRepository: Repository<Transaction> ,
		        @InjectRepository(Type) private typeRepository: Repository<Type> ,
		        @InjectRepository(Status) private statusRepository: Repository<Status> ) {}


	async createTransaction(transaction: CreateTransactionDto ){
		
		const typeFound = await this.typeRepository.findOne({
			where:{
				id: transaction.tranferTypeId
			}
		});

		const statusFound = await this.statusRepository.findOne({
			where:{
				name: 'PENDING'
			}
		});

		if( !typeFound ){
			return // agregar exception
		}

		if ( !statusFound ){
			return // agregar exception
		}

		const newTransaction = this.transactionRepository.create(transaction);
		newTransaction.transactionType = typeFound;
		newTransaction.transactionStatus = statusFound;
		return this.transactionRepository.save(newTransaction)
	}


}
