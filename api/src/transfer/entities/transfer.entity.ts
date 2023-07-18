import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn,  } from "typeorm";
import { TransferStatus } from "./transfer-status.entity";
import { TransferType } from "./transfer-type.entity";


@Entity()
export class Transfer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    transactionExternalId: string;

    @OneToOne(() => TransferStatus)
    @JoinColumn({name: 'transferStatusId'})
    transactionStatus: TransferStatus

    @OneToOne(() => TransferType)
    @JoinColumn({name: 'transferTypeId'})
    transactionType: TransferType

    @Column()
    value: number;

    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
}


