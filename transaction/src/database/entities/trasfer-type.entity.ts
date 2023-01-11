import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'transfer_types' })
export class TransferType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
  })
  createdAt: Date;
}
