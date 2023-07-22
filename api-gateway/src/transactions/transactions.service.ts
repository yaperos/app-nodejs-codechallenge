import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transactionstatus } from 'src/transactionstatus/entities/transactionstatus.entity';
import { TransactionstatusService } from 'src/transactionstatus/transactionstatus.service';
import { Transfertype } from 'src/transfertypes/entities/transfertype.entity';
import { TransfertypesService } from 'src/transfertypes/transfertypes.service';
import { Repository } from 'typeorm';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { UpdateTransactionInput } from './dto/update-transaction.input';
import { Transaction } from "./entities/transaction.entity";

@Injectable()
export class TransactionsService {

    constructor(@InjectRepository(Transaction) private transactionRepository: Repository<Transaction>, 
    private _transferTypeService: TransfertypesService, private _transactionStatusService: TransactionstatusService

    ){}

    create(createTransactionInput: CreateTransactionInput): Promise<Transaction> {
        const new_data = this.transactionRepository.create(createTransactionInput);
        return this.transactionRepository.save(new_data)
    }

    async findAll(): Promise<Transaction[]> {
        return this.transactionRepository.find();
    }

    async findOne(id: string): Promise<Transaction> {
        return this.transactionRepository.findOne({
          where: {
            id
          }
        });
      }

    update(id: string, updateTransactionInput: UpdateTransactionInput){
        return this.transactionRepository.update(id,updateTransactionInput);
    }

    async getTransferType(id: number): Promise<Transfertype>{
        return this._transferTypeService.findOne(id)
    }

    async getTransactionStatus(id:number): Promise<Transactionstatus>{
        return this._transactionStatusService.findOne(id)
    }
}
