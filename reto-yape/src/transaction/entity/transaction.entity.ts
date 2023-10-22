import { ObjectType, Field, Int, Float } from '@nestjs/graphql'
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { TransactionStatusEntity } from './transaction-status.entity'
import { TransactionTypeEntity } from './transaction-type.entity'

@Entity({ name: 'transaction' })
@ObjectType()
export class TransactionEntity {
    @PrimaryGeneratedColumn('uuid')
    @Field()
    transactionExternalId: string

    @ManyToOne(() => TransactionTypeEntity)
    @JoinColumn({ name: 'tranferTypeId' })
    @Field()
    transactionType: TransactionTypeEntity

    @ManyToOne(() => TransactionStatusEntity)
    @JoinColumn({ name: 'transactionStatusId' })
    @Field()
    transactionStatus: TransactionStatusEntity

    @Column({ type: 'uuid' })
    @Field()
    accountExternalIdDebit: string

    @Column({ type: 'uuid' })
    @Field()
    accountExternalIdCredit: string

    @Column({ type: 'float' })
    @Field((type) => Float)
    value: number

    @CreateDateColumn()
    @Field()
    createdAt: Date

    @UpdateDateColumn()
    @Field()
    updatedAt: Date
}