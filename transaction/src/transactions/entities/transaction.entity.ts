import { ObjectType, Field } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionStatus} from 'src/transactions/entities/transaction-status.entity'
import { TransactionType} from 'src/transactions/entities/transaction-type.entity'

@Entity({name: "transaction", schema: "public", synchronize: true})
@ObjectType()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: 'id of the transaction' })
  transactionExternalId: string;

  @Column()
  @Field(() => String, { description: 'id of the account debited' })
  accountExternalIdDebit: string;

  @Column()
  @Field(() => String, { description: 'id of the account credited' })
  accountExternalIdCredit: string;

  @ManyToOne(() => TransactionStatus, transactionStatus => transactionStatus.id)
  @JoinColumn({name: 'transactionStatusId'})
  @Field(() => TransactionStatus, { description: 'status of the transaction' })
  transactionStatus: TransactionStatus

  @Column()
  transactionStatusId: number

  @ManyToOne(() => TransactionType, transactionType => transactionType.id)
  @JoinColumn({name: 'transactionTypeId'})
  @Field(() => TransactionType, { description: 'type of the transaction' })
  transactionType: TransactionType

  @Column()
  transactionTypeId: number

  @Column('decimal', { precision: 6, scale: 2 })
  @Field(() => String, { description: 'amount of the transaction' })
  value: number

  @CreateDateColumn()
  @Field(() => String, { description: 'date creation of the transaction' })
  createdAt: Date;
}