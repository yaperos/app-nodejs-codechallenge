import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base-entity";

@Entity('transactions_statuses')
export class TransactionStatus extends BaseEntity {

    @Column({ type: 'varchar', length: 100, nullable: false })
    name?: string;

}