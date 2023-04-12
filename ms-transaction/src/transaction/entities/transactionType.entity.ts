import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class TransactionType {

    @Field()
    @PrimaryGeneratedColumn("identity")
    transactionTypeId: number;

    @Field()
    @Column('varchar', { length: 20 })
    name: string;

}
