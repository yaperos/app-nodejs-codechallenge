import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TRANSACTION_STATUS_DB } from 'src/utils';
import { Repository, Transaction } from 'typeorm';
import { CreateTransactionstatusInput } from './dto/create-transactionstatus.input';
import { UpdateTransactionstatusInput } from './dto/update-transactionstatus.input';
import { Transactionstatus } from './entities/transactionstatus.entity';

@Injectable()
export class TransactionstatusService {

  constructor(@InjectRepository(Transactionstatus) private _transactionStatusRepository: Repository<Transactionstatus>) {
    this.populateTransactionStatus()
  }

  //only used for testing
  async populateTransactionStatus() {
    const totalTransferTypes =  await this._transactionStatusRepository.count();
    if(totalTransferTypes == 0) {
      TRANSACTION_STATUS_DB.forEach(async (transfertype) => {
        const _transfertype = await this._transactionStatusRepository.create(transfertype);
        await this._transactionStatusRepository.save(_transfertype)
    })
    }
  }

  create(createTransactionstatusInput: CreateTransactionstatusInput): Promise<Transactionstatus> {
    const newTransferType = this._transactionStatusRepository.create(createTransactionstatusInput);
    return this._transactionStatusRepository.save(newTransferType)
  }
 
  findAll(): Promise<Transactionstatus[]> {
    return this._transactionStatusRepository.find({
      relations: ["transactions"]
    });
  }

  findOne(id: number): Promise<Transactionstatus> {
    return this._transactionStatusRepository.findOne({
      where: {
        id
      }
    });
  }

  update(id: number, updateTransactionstatusInput: UpdateTransactionstatusInput) {
    return `This action updates a #${id} transactionstatus`;
  }

  remove(id: number) {
    return `This action removes a #${id} transactionstatus`;
  }
}
