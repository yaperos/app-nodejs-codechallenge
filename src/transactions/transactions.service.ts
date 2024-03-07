import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { Type } from '../type/type.entity';
import { Status } from '../status/status.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ProducerService } from './producer.service';

@Injectable()
export class TransactionsService {

	constructor(private readonly producerService: ProducerService, 
				@InjectRepository(Transaction) private transactionRepository: Repository<Transaction> ,
		        @InjectRepository(Type) private typeRepository: Repository<Type> ,
		        @InjectRepository(Status) private statusRepository: Repository<Status> ) {}


	async create(transaction: CreateTransactionDto ){
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
			return new NotFoundException('Type not found')
		}
		if ( !statusFound ){
			return new NotFoundException('Status not found')
		}
		const newTransaction = this.transactionRepository.create(transaction);
		newTransaction.transactionType = typeFound;
		newTransaction.transactionStatus = statusFound;
		newTransaction.transactionExternalId = transaction.accountExternalIdCredit;
	
		const transactionSaved = this.transactionRepository.save(newTransaction)
		await this.producerService.send(await transactionSaved);
		return transactionSaved;
	}


	async updateStatus(status: string, externalId: string){
		const statusFound = await this.statusRepository.findOne({
			where:{
				name: status
			}
		});
		if ( !statusFound ){
			return new NotFoundException('Status not found')
		}
		var transaction = await this.transactionRepository.findOne({
			where:{
				transactionExternalId: externalId
			}
		})
		if ( !transaction ){
			return new NotFoundException('Type not found')
		}
	 	transaction.transactionStatus = statusFound;
		this.transactionRepository.update({transactionExternalId: externalId}, transaction);
	}



	async get(id: string) : Promise<Transaction> {
		const transaction = await this.transactionRepository.findOne({
			relations: ['transactionType', 'transactionStatus'],
			where:{
				id: id
			}
		})

		if(!transaction){
			throw new NotFoundException('Type not found')
		}
		return transaction;
	}
}
