import {
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionEvent } from './dto/create-transaction.event';
import { Transaction } from './entities/transaction.entity';
import { TransactionDto } from './dto/transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Observable } from 'rxjs';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @Inject('ANTI_FRAUD') private readonly antiFraudClient: ClientKafka,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async onModuleInit() {
    this.antiFraudClient.subscribeToResponseOf('anti-fraud');
    await this.antiFraudClient.connect();
  }

  async createTransaction(
    transactionReq: TransactionDto,
  ): Promise<Observable<any>> {
    const newTransaction = await this.transactionRepository.create(
      transactionReq,
    );
    const transaction = await this.transactionRepository.save(newTransaction);

    return this.antiFraudClient.send(
      'anti-fraud',
      new CreateTransactionEvent(
        transaction.id,
        transaction.transactionExternalId,
        transaction.transactionStatus,
        transaction.value,
      ),
    );
  }

  findAll() {
    return this.transactionRepository.find({ order: { value: 'ASC' } });
  }

  findOne(id: number) {
    return this.transactionRepository.findOneBy({ id });
  }

  async update(updateTransactionDto: UpdateTransactionDto) {
    return this.transactionRepository.save(updateTransactionDto);
  }

  remove(id: number) {
    return this.transactionRepository.softDelete(id);
  }
}
