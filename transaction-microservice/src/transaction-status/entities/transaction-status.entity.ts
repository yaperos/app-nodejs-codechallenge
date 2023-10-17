import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Transaction } from 'src/transaction/transaction.entity';
import { OneToMany, Column, Entity, PrimaryGeneratedColumn} from 'typeorm'

@Entity()
@ObjectType()
export class TransactionStatus {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  name: string;
  
  @OneToMany(()=>Transaction, (transaction)=>transaction.transactionStatus)
  @Field(()=>[Transaction], {nullable:true})
  transactions: Transaction[];
}
