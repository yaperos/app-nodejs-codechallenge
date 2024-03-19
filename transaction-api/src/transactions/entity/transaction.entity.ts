import { Column, PrimaryGeneratedColumn, Entity, ManyToOne, SelectQueryBuilder } from 'typeorm';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { TransactionType } from './transactionType.entity';
import { TransactionStatus } from './transactionStatus.entity';

@Entity()
@ObjectType()
export class Transaction {
    @PrimaryGeneratedColumn()
    @Field(type => Int)
    transactionExternalId: number;

    @Column({type: "int", nullable: true})
    @Field(type => Int)
    accountExternalIdDebit?: number;

    @Column({type: "int", nullable: true})
    @Field(type => Int)
    accountExternalIdCredit?: number;

    @Column({type: "int"})
    @Field(type => Float)
    value: number;
    
    @Column({type: 'int'})
    @Field(type => Int)
    transactionTypeId: number;

    @Column({type: 'int'})
    @Field(type => Int)
    transactionStatusId: number;

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    @Field(type => Date)
    createdAt: Date;

    @ManyToOne(() => TransactionType, transactionType => transactionType.id)
    @Field(type=> TransactionType)
    transactionType: TransactionType;

    @ManyToOne(() => TransactionStatus, transactionStatus => transactionStatus.id)
    @Field(type=> TransactionStatus)
    transactionStatus: Promise<TransactionStatus>;

}
