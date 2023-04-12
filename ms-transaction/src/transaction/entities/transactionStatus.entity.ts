import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class TransactionStatus {

	@Field()
	@PrimaryGeneratedColumn("identity")
	transactionStatusId: number;

	@Field()
	@Column('varchar', { length: 20 })
	name: string;

}