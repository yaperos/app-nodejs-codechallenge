import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionDB } from './graphql';

@Injectable()
export class AppService {
  constructor(
    @Inject('ANTI-FRAUD') private readonly antiFraud: ClientKafka,
    // @InjectRepository(TransactionDB)
    // private transactionRepository: Repository<TransactionDB>,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }
}
