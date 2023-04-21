import { Field, Int, ObjectType } from "@nestjs/graphql";
import { TRANSACTION_STATUS } from "src/domain/transaction/constants/transaction-status.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ObjectType()
@Entity()
export class Transaction {
    @Field()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column()
    accountExternalIdDebit: string;

    @Field()
    @Column()
    accountExternalIdCredit: string;

    @Field(() => Int)
    @Column()
    tranferTypeId: number;

    @Field(() => Int)
    @Column()
    value: number;

    @Field(() => Int)
    @Column({ default: TRANSACTION_STATUS.PENDING })
    tranferStatusId?: number;

    @Field()
    @Column('timestampz')
    @CreateDateColumn()
    createdAt?: Date;

    @Column('timestamptz')
    @UpdateDateColumn()
    updatedAt?: Date;
}