import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
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
			return new InternalServerErrorException('Type not found')
		}
		if ( !statusFound ){
			return new InternalServerErrorException('Status not found')
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
			return new InternalServerErrorException('Status not found')
		}
		var transaction = await this.transactionRepository.findOne({
			where:{
				transactionExternalId: externalId
			}
		})
		if ( !transaction ){
			return new InternalServerErrorException('Type not found')
		}
	 	transaction.transactionStatus = statusFound;
		this.transactionRepository.update({transactionExternalId: externalId}, transaction);
	}


}
