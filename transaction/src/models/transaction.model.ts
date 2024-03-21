import { Field, Float, ID, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TransactionStatus } from "./transaction-status.model";
import { TransactionType } from "./transaction-type.model";

@ObjectType({description: 'Transaction'})
@Entity('Transaction')
export class Transaction {
    
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    transactionExternalId: string;

    @Field()
    @Column({type: "uuid", nullable: false})
    accountExternalIdDebit: string;

    @Field()
    @Column({type: "uuid", nullable: false})
    accountExternalIdCredit: string;
    
    @Field(type => Float)
    @Column({type: "float", nullable: false})
    value: number;

    @Field()
    @CreateDateColumn()
    createdAt: Date

    @Field({nullable: true})
    @UpdateDateColumn()
    updatedAt: Date

    /* Relaciones */    
    @Field(() => TransactionStatus)
    @ManyToOne(() => TransactionStatus, transactionStatus => transactionStatus.transactions, { eager: true })
    @JoinColumn({ name: 'TransactionStatus' })
    transactionStatus: TransactionStatus;
    
    @Field(() => TransactionType)
    @ManyToOne(() => TransactionType, transactionType => transactionType.transactions, { eager: true })
    @JoinColumn({ name: 'TransactionType' })
    transactionType: TransactionType;
    /* Fin Relaciones */
}