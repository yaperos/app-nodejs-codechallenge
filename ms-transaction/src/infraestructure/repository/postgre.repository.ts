import { Repository } from 'typeorm';
import { TransactionEntity } from 'src/domain/Transaction.entity';
import { TransactionRepository } from 'src/domain/Transaction.repository';
import { TransactionModel } from '../model/transaction.model';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, Logger, NotFoundException } from '@nestjs/common';
import { Status } from 'src/helper/const.helper';

export class PostgresRepository implements TransactionRepository {
  private readonly logger = new Logger('postgress');
  constructor(
    @InjectRepository(TransactionModel)
    private trxRepository: Repository<TransactionModel>,
  ) {}
  async registerTrx(trx: TransactionEntity): Promise<any> {
    this.logger.log(trx);
    const newTrx = this.trxRepository.create(trx);
    return this.trxRepository.save(newTrx);
  }

  async findTrx(id: string): Promise<any> {
    const res = await this.trxRepository.findOne({
      where: {
        id,
      },
      relations: ['tranferType'],
    });
    this.logger.log(id);
    if(!res){  
      return new  NotFoundException('No se encontro la transaction');
    }
    return res;
  }

  async updateStatus(id: string, status: string) {
    const updatedTrx = await this.trxRepository.findOne({ where: { id } });
    if (status == Status.APPROVED) {
      updatedTrx.status = Status.APPROVED;
    } else {
      updatedTrx.status = Status.REJECT;
    }
    return await this.trxRepository.save(updatedTrx);
  }
}
