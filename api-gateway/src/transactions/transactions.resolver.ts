import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Transaction } from './entities/transaction.entity';
import { TransactionsService } from './transactions.service';
import { CreateTransactionInput } from "./dto/create-transaction.input";
import { KafkaService } from "../kafka/kafka.service";
import { UpdateTransactionInput } from './dto/update-transaction.input';
import { Transfertype } from 'src/transfertypes/entities/transfertype.entity';
import { Transactionstatus } from 'src/transactionstatus/entities/transactionstatus.entity';
import { TRANSACTION_STATUS } from 'src/utils';

@Resolver((of) => Transaction)
export class TransactionsResolver {
    constructor ( private _transactionService: TransactionsService, private _kafkaService: KafkaService) {}

    @Mutation(() => Transaction)
    async createTransaction(@Args('createTransactionInput') createTransactionInput: CreateTransactionInput) {
      let newTransaction = await this._transactionService.create(createTransactionInput);

      const result = await this._kafkaService.antifraudService(newTransaction);
      let editedValue: UpdateTransactionInput = {...newTransaction, id:result.id}
      if(result){
         editedValue = {
          ...newTransaction,
          id: result.id,
          transactionStatusId: result.isValid ? TRANSACTION_STATUS.APPROVED : TRANSACTION_STATUS.REJECTED
        }
        this._transactionService.update(editedValue.id, editedValue)
      }
      return editedValue;
    }
    
    @Query( returns =>  [Transaction], { name: 'transactions' })
    async transactions() {
        const res = await this._transactionService.findAll();
        console.log(res)
        return res;
    }

    @Query( returns =>  Transaction, { name: 'transaction' })
    async transaction(@Args('id') id: string) {
        const res = await this._transactionService.findOne(id);
        console.log(res)
        return res;
    }

    @ResolveField(returns => Transfertype)
    transactionType(@Parent() transaction: Transaction): Promise<Transfertype>{ 
      return this._transactionService.getTransferType(transaction.transactionTypeId)
    }

    @ResolveField( returns => Transactionstatus)
    transactionStatus(@Parent() transaction: Transaction): Promise<Transactionstatus>{
      return this._transactionService.getTransactionStatus(transaction.transactionStatusId)
    }

}

