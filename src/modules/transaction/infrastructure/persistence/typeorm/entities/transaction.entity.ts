import { Column, Entity, PrimaryColumn, Generated, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToOne } from "typeorm";
import { TransactionStatusEnum } from "../../../../domain/enums/transaction-status.enum";
import { TransferTypeEntity } from "./transfer-type.entity";

@Entity('Transaction')
export class TransactionEntity extends BaseEntity {
    @PrimaryColumn()
    @Generated('increment')
    id: number;

    @Column({
        nullable: false
    })
    account_external_id_debit: string;
    
    @Column({
        nullable: false
    })
    account_external_id_credit: string;

    @Column({
        type: "enum",
        enum: TransactionStatusEnum,
        nullable: false
    })
    status: TransactionStatusEnum;

    @Column({
        nullable: false
    })
    value: number;

    @ManyToOne(() => TransferTypeEntity)
    transfer_type: TransferTypeEntity;

    @CreateDateColumn()
    created_at: Date;
    
    @UpdateDateColumn()
    updated_at: Date;
}