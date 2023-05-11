import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'Transaction' })
export class Transaction extends BaseEntity {
    @Column({ type: 'uuid', default: () => 'gen_random_uuid()' })
    transactionExternalId: string;

    @Column({ type: 'uuid', nullable: true })
    accountExternalIdDebit: string;

    @Column({ type: 'uuid', nullable: true })
    accountExternalIdCredit: string;

    @Column('int')
    transferTypeId: number;

    @Column('float')
    value: number;

    @Column('int')
    transactionStatus: number;

    @Column('int')
    transactionType: number
}