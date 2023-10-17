import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Transaction } from 'src/transaction/transaction.entity';
import { OneToMany, Column,Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
@ObjectType()
export class TranferType {
  @PrimaryGeneratedColumn()
  @Field((type) => Int) 
  id: number;

  @Column()
  @Field()
  name: string;
    
  @OneToMany(()=>Transaction,(transaction)=>transaction.tranferType)
  @Field(()=>[Transaction], {nullable:true})
  transactions: Transaction[];
}
