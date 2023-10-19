import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class Transaction {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public accountExternalIdDebit: string;

    @Column()
    public accountExternalIdCredit: string;

    @Column()
    public tranferTypeId: string;

    @Column()
    public value: number;

    @Column()
    public status: string;
}

export default Transaction;