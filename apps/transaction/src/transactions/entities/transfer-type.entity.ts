import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('transfer_types')
export class TransferType {
  @PrimaryColumn('int')
  id!: number;

  @Column({ type: 'varchar', length: 50 })
  name!: string;
}
