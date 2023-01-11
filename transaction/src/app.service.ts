import { Inject, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './database/entities/transaction.entity';
import { TransferType } from './database/entities/trasfer-type.entity';
import { ClientKafka } from '@nestjs/microservices';
import { Status } from './database/entities/status.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
    @InjectRepository(TransferType)
    private transferTypeRepo: Repository<TransferType>,
    @InjectRepository(Status)
    private statusRepo: Repository<Status>,

    @Inject('ANTI_FRAUD_SERVICE')
    private readonly validateTrasactionClient: ClientKafka,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async findTransactionById() {
    return await this.transactionRepo.find();
  }

  async transactionCreated(data: CreateTransactionDto) {
    data.statusId = 1;

    const statusTransaction = await new Promise<any>((resolve) => {
      this.validateTrasactionClient
        .send<any>('validate_transaction', { transaction: data })
        .subscribe((result) => {
          resolve(result);
        });
    });
    if (statusTransaction.valid) {
      data.statusId = 2;
    } else {
      data.statusId = 3;
    }

    if (!statusTransaction.valid) {
      return { statusTransaction };
    }
    const transaction = this.transactionRepo.create(data);
    const response = await this.transactionRepo.save(transaction);

    response.transferType = await this.transferTypeRepo.findOneBy({
      id: response.tranferTypeId,
    });
    response.status = await this.statusRepo.findOneBy({
      id: response.statusId,
    });
    return { response };
  }
}
