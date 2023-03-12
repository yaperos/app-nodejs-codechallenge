import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TransactionType {

    @PrimaryGeneratedColumn("identity")
    transactionTypeId: number;

    @Column({ type: "varchar" })
    name: string;

}
