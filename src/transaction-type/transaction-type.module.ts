import { Module } from '@nestjs/common';
import { TransactionTypeService } from './transaction-type.service';
import { TransactionTypeResolver } from './transaction-type.resolver';
import { TransactionType } from './transaction-type.entity';
import { TypeOrmModule} from '@nestjs/typeorm';


@Module({
  imports: [TypeOrmModule.forFeature([TransactionType])],
  providers: [TransactionTypeResolver, TransactionTypeService],
  exports: [TransactionTypeService]  

})
export class TransactionTypeModule {}
