import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity({ name: 'transactions'})
@ObjectType()
export class Transaction {

    @PrimaryGeneratedColumn('uuid')
    @Field( () => ID )
    id: string;

    @Column()
    @Field( () => String )
    transactionExternalId: string;

    @Column({ nullable: true })
    @Field( () => String, { nullable: true })
    transactionType?: string;

    @Column({ nullable: true })
    @Field( () => String, { nullable: true })
    transactionStatus?: string;

    @Column()
    @Field( () => Int )
    value: number;

    @CreateDateColumn({ type: 'timestamp with time zone', nullable: true })
    @Field( () => Date, { nullable: true })
    created_at?: Date;
    
}