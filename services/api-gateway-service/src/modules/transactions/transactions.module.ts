import { Module } from '@nestjs/common';
import { TransactionsService } from './services/transactions.service';
import { TransactionsResolver } from './resolvers/transactions.resolver';
import { CommonModule } from 'src/common/common.module';
// import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [CommonModule],
  providers: [TransactionsResolver, TransactionsService],
})
export class TransactionsModule {}
