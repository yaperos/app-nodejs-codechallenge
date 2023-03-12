import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TransactionStatus {

	@PrimaryGeneratedColumn("identity")
	transactionStatusId: number;

	@Column({ type: "varchar" })
	name: string;

}