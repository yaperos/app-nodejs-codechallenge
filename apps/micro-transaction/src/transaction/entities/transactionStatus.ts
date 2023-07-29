import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class TransactionStatus {
    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column({ unique: true })
    @Field()
    name: string;
}