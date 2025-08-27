import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('transfer_types')
export class TransferType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50 })
    name: string;
}
