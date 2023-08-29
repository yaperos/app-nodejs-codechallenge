import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('transfers_types')
export class TransferType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;
}
